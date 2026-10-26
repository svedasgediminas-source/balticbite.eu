/* BalticBite checkout: the cart's "Pereiti prie apmokėjimo" opens this form; the order goes to the shop's order app
   (admin.balticbite.eu), which checks every price and stock flag against this catalog and answers with the order number.
   The button stays disabled ("Užsakymų kol kas nepriimame") until the order app says orders are open. */
(function(){
"use strict";
const BB=window.BB;
if(!BB||document.getElementById("co"))return;
const API=/^(localhost|127\.0\.0\.1)$/.test(location.hostname)?"http://localhost:3100":"https://admin.balticbite.eu";
const $=(s,r)=>(r||document).querySelector(s);
const esc=BB.esc;
const eur=c=>BB.money(c/100);

const S={
lt:{t:"Užsakymas",back:"Atgal į krepšelį",contact:"Kontaktai",name:"Vardas ir pavardė",email:"El. paštas",phone:"Telefonas",
  dlv:"Pristatymas",pastomatas:"Į paštomatą",kurjeris:"Kurjeriu į namus",lockerL:"Paštomatas (tinklas, miestas, adresas)",lockerP:"pvz. LP Express, Vilnius, Ozo g. 25",
  addr:"Adresas",city:"Miestas",zip:"Pašto kodas",comment:"Pastaba (nebūtina)",items:"Prekės",ship:"Pristatymas",free:"nemokamai",total:"Iš viso",
  accept:"Sutinku su pirkimo sąlygomis:",shipL:"pristatymas",retL:"grąžinimas",payNote:"Apmokėjimas bankiniu pavedimu. Užsakymą patvirtinsime el. paštu ir atsiųsime mokėjimo duomenis.",
  send:"Pateikti užsakymą",sending:"Siunčiama…",min:"Mažiausia užsakymo suma – {s}. Trūksta {d}.",
  okT:"Ačiū! Užsakymas gautas",okNr:"Užsakymo numeris",okP:"Netrukus el. paštu atsiųsime patvirtinimą su apmokėjimo informacija. Prekes išsiųsime gavę apmokėjimą.",
  payT:"Mokėjimo duomenys",recv:"Gavėjas",purpose:"Mokėjimo paskirtis",amount:"Suma",okBtn:"Grįžti į parduotuvę",
  e:{closed:"Šiuo metu užsakymų nepriimame.",unavailable:"Kai kurių prekių nebėra arba pasikeitė kaina. Atnaujink puslapį ir patikrink krepšelį.",
    contact:"Nurodyk el. paštą ir telefoną.",address:"Nurodyk pristatymo adresą arba paštomatą.",terms:"Pažymėk, kad sutinki su pirkimo sąlygomis.",
    rate:"Per daug bandymų. Pabandyk po valandos.",net:"Nepavyko susisiekti su parduotuve. Patikrink ryšį ir bandyk dar kartą.",any:"Užsakymo pateikti nepavyko."}},
de:{t:"Bestellung",back:"Zurück zum Warenkorb",contact:"Kontakt",name:"Vor- und Nachname",email:"E-Mail",phone:"Telefon",
  dlv:"Versand",pastomatas:"An Packstation",kurjeris:"Paketdienst nach Hause",lockerL:"Packstation (Anbieter, Ort, Adresse)",lockerP:"z. B. DHL Packstation 123, Berlin",
  addr:"Straße und Hausnummer",city:"Ort",zip:"PLZ",comment:"Anmerkung (optional)",items:"Artikel",ship:"Versand",free:"kostenlos",total:"Gesamt",
  accept:"Ich akzeptiere die Kaufbedingungen:",shipL:"Versand",retL:"Rückgabe",payNote:"Zahlung per Banküberweisung. Wir bestätigen die Bestellung per E-Mail und senden die Zahlungsdaten.",
  send:"Bestellung absenden",sending:"Wird gesendet…",min:"Mindestbestellwert {s}. Es fehlen {d}.",
  okT:"Danke! Bestellung erhalten",okNr:"Bestellnummer",okP:"Du erhältst in Kürze eine Bestätigung mit den Zahlungsdaten per E-Mail. Wir versenden nach Zahlungseingang.",
  payT:"Zahlungsdaten",recv:"Empfänger",purpose:"Verwendungszweck",amount:"Betrag",okBtn:"Zurück zum Shop",
  e:{closed:"Derzeit nehmen wir keine Bestellungen an.",unavailable:"Einige Artikel sind nicht mehr verfügbar oder der Preis hat sich geändert. Bitte Seite neu laden und Warenkorb prüfen.",
    contact:"Bitte E-Mail und Telefon angeben.",address:"Bitte Lieferadresse oder Packstation angeben.",terms:"Bitte die Kaufbedingungen akzeptieren.",
    rate:"Zu viele Versuche. Bitte in einer Stunde erneut versuchen.",net:"Keine Verbindung zum Shop. Bitte Verbindung prüfen und erneut versuchen.",any:"Bestellung konnte nicht gesendet werden."}},
en:{t:"Order",back:"Back to cart",contact:"Contact",name:"Full name",email:"Email",phone:"Phone",
  dlv:"Delivery",pastomatas:"To a parcel locker",kurjeris:"Courier to your door",lockerL:"Parcel locker (network, city, address)",lockerP:"e.g. LP Express, Vilnius, Ozo g. 25",
  addr:"Address",city:"City",zip:"Postcode",comment:"Note (optional)",items:"Items",ship:"Delivery",free:"free",total:"Total",
  accept:"I accept the terms of purchase:",shipL:"delivery",retL:"returns",payNote:"Payment by bank transfer. We will confirm the order by email and send the payment details.",
  send:"Place order",sending:"Sending…",min:"Minimum order {s}. {d} to go.",
  okT:"Thank you! Order received",okNr:"Order number",okP:"We will shortly email you a confirmation with the payment details. Items ship once payment is received.",
  payT:"Payment details",recv:"Recipient",purpose:"Payment reference",amount:"Amount",okBtn:"Back to the shop",
  e:{closed:"We are not taking orders right now.",unavailable:"Some items are no longer available or their price changed. Reload the page and check your cart.",
    contact:"Enter your email and phone.",address:"Enter a delivery address or parcel locker.",terms:"Please accept the terms of purchase.",
    rate:"Too many attempts. Try again in an hour.",net:"Couldn't reach the shop. Check your connection and try again.",any:"The order couldn't be placed."}},
ru:{t:"Заказ",back:"Назад в корзину",contact:"Контакты",name:"Имя и фамилия",email:"Эл. почта",phone:"Телефон",
  dlv:"Доставка",pastomatas:"В почтомат",kurjeris:"Курьером на дом",lockerL:"Почтомат (сеть, город, адрес)",lockerP:"напр. LP Express, Vilnius, Ozo g. 25",
  addr:"Адрес",city:"Город",zip:"Почтовый индекс",comment:"Примечание (необязательно)",items:"Товары",ship:"Доставка",free:"бесплатно",total:"Итого",
  accept:"Я согласен с условиями покупки:",shipL:"доставка",retL:"возврат",payNote:"Оплата банковским переводом. Мы подтвердим заказ по эл. почте и пришлём платёжные данные.",
  send:"Оформить заказ",sending:"Отправка…",min:"Минимальная сумма заказа – {s}. Не хватает {d}.",
  okT:"Спасибо! Заказ получен",okNr:"Номер заказа",okP:"Вскоре мы пришлём подтверждение с платёжными данными на эл. почту. Товары отправим после оплаты.",
  payT:"Платёжные данные",recv:"Получатель",purpose:"Назначение платежа",amount:"Сумма",okBtn:"Вернуться в магазин",
  e:{closed:"Сейчас заказы не принимаются.",unavailable:"Некоторых товаров уже нет или изменилась цена. Обнови страницу и проверь корзину.",
    contact:"Укажи эл. почту и телефон.",address:"Укажи адрес доставки или почтомат.",terms:"Отметь согласие с условиями покупки.",
    rate:"Слишком много попыток. Попробуй через час.",net:"Не удалось связаться с магазином. Проверь соединение и попробуй ещё раз.",any:"Не удалось оформить заказ."}},
pl:{t:"Zamówienie",back:"Wróć do koszyka",contact:"Kontakt",name:"Imię i nazwisko",email:"E-mail",phone:"Telefon",
  dlv:"Dostawa",pastomatas:"Do paczkomatu",kurjeris:"Kurierem do domu",lockerL:"Paczkomat (sieć, miasto, adres)",lockerP:"np. LP Express, Vilnius, Ozo g. 25",
  addr:"Adres",city:"Miasto",zip:"Kod pocztowy",comment:"Uwagi (opcjonalnie)",items:"Produkty",ship:"Dostawa",free:"gratis",total:"Razem",
  accept:"Akceptuję warunki zakupu:",shipL:"dostawa",retL:"zwroty",payNote:"Płatność przelewem bankowym. Potwierdzimy zamówienie e-mailem i prześlemy dane do płatności.",
  send:"Złóż zamówienie",sending:"Wysyłanie…",min:"Minimalna wartość zamówienia {s}. Brakuje {d}.",
  okT:"Dziękujemy! Zamówienie przyjęte",okNr:"Numer zamówienia",okP:"Wkrótce wyślemy e-mailem potwierdzenie z danymi do płatności. Wysyłka po zaksięgowaniu wpłaty.",
  payT:"Dane do płatności",recv:"Odbiorca",purpose:"Tytuł przelewu",amount:"Kwota",okBtn:"Wróć do sklepu",
  e:{closed:"Obecnie nie przyjmujemy zamówień.",unavailable:"Niektóre produkty są niedostępne lub zmieniła się cena. Odśwież stronę i sprawdź koszyk.",
    contact:"Podaj e-mail i telefon.",address:"Podaj adres dostawy lub paczkomat.",terms:"Zaakceptuj warunki zakupu.",
    rate:"Zbyt wiele prób. Spróbuj za godzinę.",net:"Brak połączenia ze sklepem. Sprawdź połączenie i spróbuj ponownie.",any:"Nie udało się złożyć zamówienia."}}
};
const s=()=>S[BB.lang()]||S.en;
const MK=()=>BB.market()==="de"?"DE":"LT";

/* ---------- styles (site tokens) ---------- */
const css=document.createElement("style");
css.textContent=`
#co{position:fixed;inset:0 0 0 auto;margin:0;width:min(520px,100vw);height:100%;max-height:100%;border-left:1px solid var(--line);box-shadow:-24px 0 60px -30px rgba(0,0,0,.35)}
#co[open]{animation:sheet-in 180ms var(--ease)}
#co .co-head{display:flex;align-items:center;gap:10px;padding:18px 64px 14px 16px;border-bottom:1px solid var(--line)}
#co .co-head h2{font:600 26px/1 var(--fh);letter-spacing:.01em;margin:0}
#co .co-bk{width:40px;height:40px;display:grid;place-items:center;border:0;background:transparent;color:var(--ink);border-radius:var(--r)}
#co .co-body{flex:1 1 auto;min-height:0;overflow:auto;overscroll-behavior:contain;padding:8px 24px 24px}
#co fieldset{border:0;margin:0;padding:0}
#co legend,#co h3{font:600 13px/1 var(--fb);letter-spacing:.1em;text-transform:uppercase;color:var(--ink-3);margin:22px 0 10px;padding:0}
#co .f{display:block;margin:0 0 12px}
#co .f>span{display:block;font-size:14px;color:var(--ink-2);margin-bottom:5px}
#co input[type=text],#co input[type=email],#co input[type=tel],#co textarea{display:block;width:100%;min-height:46px;padding:10px 12px;border:1px solid var(--field);border-radius:3px;background:var(--surface);color:var(--ink);font:400 16px/1.3 var(--fb)}
#co textarea{min-height:76px;resize:vertical}
#co input:focus,#co textarea:focus{outline:0;border-color:var(--ink);box-shadow:0 0 0 1px var(--ink)}
#co .row2{display:grid;grid-template-columns:2fr 1fr;gap:10px}
#co .opt{display:flex;align-items:center;gap:12px;min-height:50px;padding:10px 14px;border:1px solid var(--line-2);border-radius:3px;margin-bottom:8px;cursor:pointer}
#co .opt:has(input:checked){border-color:var(--ink);box-shadow:0 0 0 1px var(--ink)}
#co .opt b{margin-left:auto;font-weight:600;font-variant-numeric:tabular-nums}
#co .opt input,#co .acc input{width:20px;height:20px;accent-color:var(--accent);flex:none;margin:0}
#co .sum{list-style:none;margin:0;padding:0;border-top:1px solid var(--line)}
#co .sum li{display:flex;gap:12px;justify-content:space-between;padding:9px 0;border-bottom:1px solid var(--line);font-size:14.5px}
#co .sum li span{color:var(--ink-2)}
#co .sum li b{font-weight:600;white-space:nowrap;font-variant-numeric:tabular-nums}
#co .sum li.tot{border-bottom:0;font-size:18px}#co .sum li.tot span{color:var(--ink)}
#co .acc{display:flex;gap:12px;align-items:flex-start;margin:18px 0 6px;font-size:14.5px;line-height:1.45;cursor:pointer}
#co .note{font-size:13.5px;color:var(--ink-3);margin:8px 0 0}
#co .err{margin:14px 0 0;padding:10px 12px;border-left:3px solid var(--accent);background:var(--bg-2);font-size:14.5px}
#co .co-foot{padding:14px 24px calc(18px + env(safe-area-inset-bottom));border-top:1px solid var(--ink);background:var(--surface)}
#co .co-foot .btn{width:100%;min-height:50px}
#co .hp{position:absolute!important;left:-9999px;width:1px;height:1px;overflow:hidden}
#co .ok{padding-top:18px}
#co .ok .nr{font:600 34px/1.1 var(--fh);margin:6px 0 14px;font-variant-numeric:tabular-nums}
#co dl.pay{display:grid;grid-template-columns:auto 1fr;gap:6px 14px;margin:0;font-size:14.5px}
#co dl.pay dt{color:var(--ink-2)}#co dl.pay dd{margin:0;font-weight:600;word-break:break-word}
@media (max-width:480px){#co .co-body{padding:8px 16px 20px}#co .co-foot{padding:12px 16px calc(16px + env(safe-area-inset-bottom))}}
`;
document.head.appendChild(css);

/* ---------- dialog ---------- */
const dl=document.createElement("dialog");
dl.id="co";dl.setAttribute("aria-labelledby","coT");
dl.innerHTML=`<div class="dlg-in">
  <div class="co-head"><button type="button" class="co-bk" id="coBack"><span style="display:inline-flex;transform:scaleX(-1)">${BB.ui("u-arrow")}</span></button><h2 id="coT"></h2></div>
  <button type="button" class="x" data-close>${BB.ui("u-close")}</button>
  <form class="co-body" id="coF" novalidate></form>
  <div class="co-foot" id="coFoot"><button type="submit" form="coF" class="btn btn-p" id="coGo"></button></div>
</div>`;
document.body.appendChild(dl);

let cfg=null,busy=false,draft={};
function lines(){
  return Array.from(BB.cart()).map(([key,q])=>{const r=BB.resolve(key);if(!r)return null;const p=BB.P[r.i],v=p.v[r.j],L=p[BB.lang()]||p.lt;
    const lab=BB.vlabel(v);return{sku:String(v[0]),qty:q,name:L.n+(lab&&lab!==L.n?", "+lab:""),cents:Math.round(BB.vprice(v)*100)}}).filter(Boolean);
}
function shipCents(items,dlv){const m=cfg&&cfg[MK()];if(!m)return 0;return m.free_cents&&items>=m.free_cents?0:m.ship_cents}
function keep(){const f=$("#coF");if(!f||!f.elements.name)return;["name","email","phone","address","city","postcode","comment"].forEach(k=>{if(f.elements[k])draft[k]=f.elements[k].value});const d=f.querySelector("[name=delivery]:checked");if(d)draft.delivery=d.value}

function renderForm(err){
  const t=s(),mk=MK(),ls=lines(),items=ls.reduce((a,l)=>a+l.cents*l.qty,0);
  const opts=mk==="DE"?["kurjeris"]:["pastomatas","kurjeris"];
  let dlv=opts.indexOf(draft.delivery)>=0?draft.delivery:opts[0];
  const sh=shipCents(items,dlv),min=(cfg&&cfg[mk]&&cfg[mk].min_cents)||0,short=min&&items<min?min-items:0;
  const v=k=>esc(draft[k]||"");
  $("#coT").textContent=t.t;$("#coBack").setAttribute("aria-label",t.back);
  dl.querySelector(".x").setAttribute("aria-label",(BB.D().close)||"×");
  $("#coF").innerHTML=`
  <fieldset><legend>${esc(t.contact)}</legend>
    <label class="f"><span>${esc(t.name)}</span><input type="text" name="name" autocomplete="name" required maxlength="120" value="${v("name")}"></label>
    <label class="f"><span>${esc(t.email)}</span><input type="email" name="email" autocomplete="email" required maxlength="160" value="${v("email")}"></label>
    <label class="f"><span>${esc(t.phone)}</span><input type="tel" name="phone" autocomplete="tel" required maxlength="40" value="${v("phone")}"></label>
  </fieldset>
  <fieldset><legend>${esc(t.dlv)}</legend>
    ${opts.map(o=>`<label class="opt"><input type="radio" name="delivery" value="${o}"${o===dlv?" checked":""}><span>${esc(t[o])}</span><b>${sh?eur(sh):esc(t.free)}</b></label>`).join("")}
    <div id="coAddr"></div>
  </fieldset>
  <label class="f"><span>${esc(t.comment)}</span><textarea name="comment" maxlength="1000">${v("comment")}</textarea></label>
  <h3>${esc(t.items)}</h3>
  <ul class="sum">${ls.map(l=>`<li><span>${esc(l.name)} × ${l.qty}</span><b>${eur(l.cents*l.qty)}</b></li>`).join("")}
    <li><span>${esc(t.ship)}</span><b>${sh?eur(sh):esc(t.free)}</b></li>
    <li class="tot"><span>${esc(t.total)}</span><b>${eur(items+sh)}</b></li></ul>
  ${short?`<p class="err" role="alert">${esc(t.min.replace("{s}",eur(min)).replace("{d}",eur(short)))}</p>`:""}
  <label class="acc"><input type="checkbox" name="accept" required><span>${esc(t.accept)} <button type="button" class="lnk" data-info="ship">${esc(t.shipL)}</button>, <button type="button" class="lnk" data-info="ret">${esc(t.retL)}</button>.</span></label>
  <p class="note">${esc(t.payNote)}</p>
  <div class="hp" aria-hidden="true"><input type="text" name="website" tabindex="-1" autocomplete="off"></div>
  <div id="coErr">${err?`<p class="err" role="alert">${esc(err)}</p>`:""}</div>`;
  renderAddr(dlv);
  const go=$("#coGo");go.textContent=t.send;go.disabled=!ls.length||!!short;
  $("#coFoot").hidden=false;
}
function renderAddr(dlv){
  const t=s();const v=k=>esc(draft[k]||"");
  $("#coAddr").innerHTML=dlv==="pastomatas"
    ?`<label class="f"><span>${esc(t.lockerL)}</span><input type="text" name="address" required maxlength="240" placeholder="${esc(t.lockerP)}" value="${v("address")}"></label>`
    :`<label class="f"><span>${esc(t.addr)}</span><input type="text" name="address" autocomplete="street-address" required maxlength="240" value="${v("address")}"></label>
      <div class="row2"><label class="f"><span>${esc(t.city)}</span><input type="text" name="city" autocomplete="address-level2" required maxlength="80" value="${v("city")}"></label>
      <label class="f"><span>${esc(t.zip)}</span><input type="text" name="postcode" autocomplete="postal-code" inputmode="numeric" required maxlength="20" value="${v("postcode")}"></label></div>`;
}
function renderOk(r,email){
  const t=s();
  $("#coT").textContent=t.t;
  const pay=r.pay||{};
  $("#coF").innerHTML=`<div class="ok" role="status">
    <h3>${esc(t.okT)}</h3><p class="muted">${esc(t.okNr)}</p><p class="nr">${esc(r.number)}</p>
    <p>${esc(t.okP)}</p>
    ${pay.iban?`<h3>${esc(t.payT)}</h3><dl class="pay"><dt>${esc(t.recv)}</dt><dd>${esc(pay.receiver||"")}</dd><dt>IBAN</dt><dd>${esc(pay.iban)}</dd>${pay.bank?`<dt>Bank</dt><dd>${esc(pay.bank)}</dd>`:""}<dt>${esc(t.purpose)}</dt><dd>${esc(pay.purpose)}</dd><dt>${esc(t.amount)}</dt><dd>${eur(r.total_cents)}</dd></dl>`:""}
  </div>`;
  const go=$("#coGo");go.textContent=t.okBtn;go.disabled=false;
}

$("#coF").addEventListener("change",e=>{if(e.target.name==="delivery"){keep();renderForm()}});
$("#coF").addEventListener("submit",async e=>{
  e.preventDefault();
  if($("#coF .ok")){BB.closeDlg(dl);return}
  if(busy)return;
  const f=e.target,t=s(),el=f.elements;keep();
  const bad=Array.from(f.querySelectorAll("input[required],textarea[required]")).find(i=>i.type==="checkbox"?!i.checked:!i.value.trim()||(i.type==="email"&&!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(i.value.trim())));
  if(bad){const k=bad.name==="accept"?"terms":(bad.name==="address"||bad.name==="city"||bad.name==="postcode")?"address":"contact";
    $("#coErr").innerHTML=`<p class="err" role="alert">${esc(t.e[k])}</p>`;bad.focus();return}
  const ls=lines();if(!ls.length)return;
  const dlv=draft.delivery||(MK()==="DE"?"kurjeris":"pastomatas");
  const body={market:MK(),name:draft.name.trim(),email:draft.email.trim(),phone:draft.phone.trim(),delivery:dlv,
    address:draft.address.trim(),city:dlv==="kurjeris"?(draft.city||"").trim():"",postcode:dlv==="kurjeris"?(draft.postcode||"").trim():"",
    country:MK(),comment:(draft.comment||"").trim(),accept:true,website:el.website.value,items:ls.map(l=>({sku:l.sku,qty:l.qty}))};
  busy=true;const go=$("#coGo");go.disabled=true;go.textContent=t.sending;
  let r,data={};
  try{r=await fetch(API+"/api/public/orders",{method:"POST",headers:{"content-type":"application/json"},body:JSON.stringify(body)});data=await r.json().catch(()=>({}))}
  catch(x){busy=false;renderForm(t.e.net);return}
  busy=false;
  if(r.ok&&data.number){
    Array.from(BB.cart().keys()).forEach(k=>BB.setQty(k,0));
    draft={};renderOk(data);return}
  const code=r.status===429?"rate":data.error;
  if(code==="closed"){cfg&&(cfg.open=false);setButton()}
  renderForm(t.e[code]||(BB.lang()==="lt"&&data.message)||t.e.any);
});
$("#coBack").addEventListener("click",()=>{keep();BB.closeDlg(dl,true);BB.openCart()});

/* ---------- cart button ---------- */
function setButton(){
  const b=document.getElementById("checkout"),n=document.getElementById("cNote");if(!b)return;
  if(cfg&&cfg.open){b.removeAttribute("aria-disabled");if(n)n.hidden=true}
  else{b.setAttribute("aria-disabled","true");if(n)n.hidden=false}
}
BB.checkout=function(opener){
  const t=BB.D();
  if(!cfg||!cfg.open){BB.toast(t.checkout,t.checkoutNote,null,"info");return}
  if(!BB.cart().size)return;
  renderForm();
  const cd=document.getElementById("cd");if(cd&&cd.open)BB.closeDlg(cd,true);
  BB.openDlg(dl,opener);
};
function load(){
  fetch(API+"/api/public/config").then(r=>r.ok?r.json():null).then(c=>{cfg=c;setButton()}).catch(()=>{});
}
load();
const rerender=()=>{if(dl.open&&!$("#coF .ok")){keep();renderForm()}};
BB.on("lang",rerender);BB.on("market",rerender);BB.on("cart",rerender);
})();
