//Objekt pro hru, abychom si vydefinovaly šířku/výšku a objekty nám nezajížděli za okraj
let hra = {
    element: document.getElementById ('hra'), //Uložení odkazu na herní plochu
    sirka: 900,
    vyska: 600,
    dalsiDarek: 150,
    skore: 0,
    skoreElement: document.getElementById('pocet'),
    hudba: document.getElementById('hudba'),
    zvukNaraz: document.getElementById('zvuk-naraz'),
    zvukSebrano: document.getElementById('zvuk-sebrano'),
    uvod: document.getElementById('uvod'),
    tlacitkoStart: document.getElementById('start'),
    konec: document.getElementById('konec'),
    tlacitkoZnovu: document.getElementById('znovu'),
    vysledek: document.getElementById('vysledek'),
    cas: 0,
    casElement: document.getElementById('cas'),
    casovac: null
  }
  
  // Objekt robota (herní objekt)
  let robot = {
    element: document.getElementById('robot'), //Napojení herního objektu na zobrazení (index.html)
    x: 0, //výchozí poloha
    y: 485, //výchozí poloha
    sirka: 135, //pro zjištění velikost, např. aby robot nenarážel do stran
    vyska: 105, //pro zjištění velikost, např. aby robot nenarážel do stran
    rychlost: 10
  }
  
  // Objekt létajících saní (herní objekt)
  let sane = {
    element: document.getElementById('sane'),
    x: 0,
    y: 10,
    sirka: 165,
    vyska: 104,
    rychlost: 2
  }
  
  //Pole čísel (Pole - umožní uložit v jedné proměnné více hodnot; Pole k dispozici metody pole - fce pro úkony s polem n. daty; Můžeme vkládat objekty, např. "robot" => pole objektů, přes push do pole)
  //Prázdné seznam (pole) dárků
  let darky = [];
  
  // Nastaví pozici robota, saní na obrazovce
  function umistiObjekt(herniObjekt) { 
    herniObjekt.element.style.left = herniObjekt.x + 'px';
    herniObjekt.element.style.top = herniObjekt.y + 'px';
  }
  
  //Posluchač (addEventListener) a ovladač události. "window" - okno prohlížeče bude čekat, dokud v něm nebude všechno načtené - "load", tím dojde k události a zavolá se "starHry" - 
  window.addEventListener('load',uvodHry);
  
  //Funkce "startHry" pro spuštění hry. Volá se po načtení obsahu stránky (viz posluchač a ovladač události). Ve fci vše, co se má provést po načtení stránky.
  function startHry() {
    //Na začátku hry vynulujeme skóre
    hra.skore = 0;
    hra.skoreElement.textContent = '0';
  
    //Nastavení objedktů do výchozí polohy na střed
    robot.x = Math.floor(hra.sirka / 2 - robot.sirka / 2);
    umistiObjekt(robot);
    umistiObjekt(sane);
    hra.hudba.play(); //Spuštění hudby
    prepniObrazovku('hra'); //Přepneme obrazovku na herní plochu
    hra.cas = 90; //výchozí čas časomíry
    zobrazCas();
  
    //Reagování na stisk klávesy (jakékoliv), zavolá se fce priStiskuKlavesy. "keydown" - stisk klávesy. "document" - stránka. Tohle posílá do fce priStiskuKlavesy eventObject různé parametry, ale ty musí být ve fci vypsané (níže viz "udalost" v zavorkach, aby na ně fce zareagovala.
    document.addEventListener('keydown', priStiskuKlavesy);
  
    //Nastartuje časovač, který bude pohybovat sáněmi, dárky, apod.
    hra.casovac = setInterval(aktualizujHru, 20);
  }
  
  //Funkce pro aktualizaci polohy objektů na obrazovce, spouští se 50x za vteřinu
  function aktualizujHru() {
    posunSane(); //Posune sáně
    posunDarky(); //Posune dárky
    otestujDarky(); //Otestuje padající dárky
    cekejNaDalsiDarek(); //Odpočítáváme do dalšího dárku
    aktualizujCas(); //Aktualizuje čas a zjistí, jestli už nedošel na 0
    if(hra.cas <=0){
      konecHry()
    }
  }
  
  //funkce pro pohyb padajících dárků
  function posunDarky() {
    //Projít všechny dárky v poli
    for (let i=0; i < darky.length; i++) {
      //Posun dárků směrem dolů
      darky[i].y = darky[i].y + darky[i].rychlost;
      //Změníme polohu obrázku dárku na obrazovce
      umistiObjekt(darky[i]);
    }
  }
  
  // Funkce při při stisku klávesy. "udalost" - proměnná, do které se uloží volání document.addEventListener, viz výše. Je to "Event object".
  function priStiskuKlavesy(udalost) {
    if (udalost.key === 'ArrowRight') {
      robot.x = robot.x + robot.rychlost;
      //Zastavení robota na okraji, šířka stránky mínus šířka robota
      if (robot.x > hra.sirka - robot.sirka) {
        robot.x = hra.sirka - robot.sirka
      }
    }
  
    if (udalost.key === 'ArrowLeft') {
      robot.x = robot.x - robot.rychlost;
      //Když robot vyjíždí mimo plochu, zastavíme ho na okraji. Osa x = 0
      if (robot.x < 0) {
        robot.x = 0
      }
    }
    umistiObjekt(robot);
  }
  
  //Funkce pro pohyb sání (na základě časovače)
  function posunSane() {
    sane.x = sane.x + sane.rychlost;
  
    //Když sáně dojedou na pravý okraj obrazovky
    if (sane.x > hra.sirka - sane.sirka) {
        sane.x = hra.sirka - sane.sirka;
        sane.rychlost = -sane.rychlost; 
        sane.element.style.transform = 'scaleX(-1)';
      }
  
    //Když sáně dojedou na levý okraj obrazovky
    if (sane.x < 0) {
        sane.x = 0;
        sane.rychlost = - sane.rychlost;
        sane.element.style.transform = 'scaleX(1)';
      }
      umistiObjekt(sane);
  }
  
  //Fce přidávání dárků do pole darky[] (lepší samostatně, bude se to volat opakovaně)
  function pridejDarek() {
    //Vytvoříme nový element pro obrázek dárku (vyskytují se náhodně)
    let obrazek = document.createElement('img'); //Výsledek metody createElement si uložíme do proměnné, ta funguje stejně, jako by v ní byl odkaz získaný pomocí getElementById
    obrazek.src = 'pictures/darek' + nahodneCislo(1, 4) + '.png'; //Adresa k souboru s obrázkem
    
    hra.element.appendChild(obrazek); //Odkaz na rodičovský prvek, do kterého chceme vložit nově vytvořený obrázek dárku.
  
    //Vytvoříme objekt nového dárku v JS
    let novyDarek = {
      element: obrazek, //Odkaz na HTML prvek s obrázkem
      x: Math.floor(sane.x + sane.sirka / 2 - 20),
      y: Math.floor(sane.y + sane.sirka / 2),
      sirka: 39,
      vyska: 44,
      rychlost: nahodneCislo(1,3)
    };
  
    //Nový dárek přidáme do seznamu
    darky.push(novyDarek);
  
    //Ihned umístí dárek na správnou pozici na obrazovce
    umistiObjekt(novyDarek);
  }
  
  //Funkce pro testování padajících dárků? Dopadl dárek na zem x chytil dárek robot?
  function otestujDarky() {
    //Projdeme pozpátku všechny dárky v poli
    for (let i = darky.length - 1; i >=0; i--) {
      //Dopadl dárek na zem?
      if (protnutiObdelniku(robot, darky[i]))
      //Obrázek dárku se protnul s obrázkem robota
      //Odstraníme sebraný dárek ze hry
      {
        odstranDarek(i);
        zvetsiSkore(); //Zvětší skóre
        hra.cas = hra.cas + 3; //Přičteme čas
        zobrazCas(); //Zobrazíme čas
        hra.zvukSebrano.play(); //Zvuk sebraného dárku
      }
      else if (darky[i].y + darky[i].vyska > hra.vyska) {
        //Dopadl dárek na zem?
        //Odstraníme dárek
        odstranDarek(i);
        hra.cas = hra.cas - 10; //Odečteme čas
        zobrazCas(); //Zobrazíme čas
        hra.zvukNaraz.play(); //Zvuk nárazu na zem
      }
    }
  }
  
  //Funkce odstraní obrázek dárku z herní plochy, smaže dárek v poli dárků
  function odstranDarek(index) {
        //Odstraníme obrázek dárku z herní plochy
        darky[index].element.remove();
        //Smaže herní objekt z pole dárků
        darky.splice(index, 1);
  }
  
  //Funkce generuje náhodné číslo od dolniLimit do horniLimit (oba včetně)
  function nahodneCislo(dolniLimit, horniLimit) {
    return dolniLimit + Math.floor(Math.random() * (horniLimit - dolniLimit + 1));
  }
  
  //Funkce odpočítává čas do vyhození nového dárku
  function cekejNaDalsiDarek() {
    if (hra.dalsiDarek === 0) {
    //Odpočet je na 0, do hry přidáme nový dárek
    pridejDarek();
  
    //Vygenerujeme náhodný čas v rozmezí 1-5 vteřin
    //Odpočítává se 50x za vteřinu, takže potřebujeme číslo 50 - 250
    hra.dalsiDarek = nahodneCislo(50, 250);
    } else {
      //Odpočet ještě není na 0, tak ho snížíme o 1
      hra.dalsiDarek--;
    }
  }
  
  //Fce pro zjištění protnutí obdélníku. Jako parametr se předávají dva horní objekty. Funkce vrátí true/false, podle toho, zda ke kolizi dochází nebo ne
  function protnutiObdelniku(a, b) {
    if (a.x + a.sirka < b.x
        || b.x + b.sirka < a.x
        || a.y + a.vyska < b.y
        || b.y + b.vyska < a.y) {
          //Obdelníky se neprotínají
          return false;
        } else {
          //Obdelníky se protínají
          return true;
        }
  }
  
  //Zvětší skóre o 1 a vypíše to na obrazovku
  function zvetsiSkore() {
    //Zvětšíme o 1
    hra.skore++;
    //Vypíšeme do prvku v hlavičce hry
    hra.skoreElement.textContent = hra.skore
  }
  
  //Funkce na přepínání obrazovky
  function prepniObrazovku(obrazovka){
    //Nejprve všechny obrazovky skryjeme
    hra.uvod.style='none'; //Úvod
    hra.element.style='none'; //Herní posluchač
  
    //Podle parametru zobrazíme příslušnou obrazovku
    if(obrazovka === 'uvod') {
      //Úvod je flexbox, nastavíme na flexbox
      hra.uvod.style.display = 'flex';
    } else if (obrazovka === 'hra'){
      //Herní plocha je blokový prvek, nastavíme na block
      hra.element.style.display = 'block';
    } else if (obrazovka === 'konec') {
      //Závěrečná obr. je stejně jako úvod flexbox, takže nastavíme na flex
      hra.konec.style.display = 'flex';
    }
  }
  
  
  //Funkce pro zobrazení úvodu hry
  function uvodHry(){
    //Přepne na úvodní obrazovku
    prepniObrazovku('uvod');
  
    //Na tlačítku budeme čekam na kliknutí, při kliknutí zavoláme startHry
    hra.tlacitkoStart.addEventListener('click',startHry);
  
    //Čekáme na kliknutí na tlačítko a závěrečné obrazovce
    hra.tlacitkoZnovu.addEventListener('click',startHry);
  }
  
  //Zobrazení závěrečné obrazovky a vypsání skóre
  function konecHry(){
    //Zastavíme časovač, který se 50x za vteřinu stará o běh hry
    clearInterval(hra.casovac);  
  
    //Zrušíme posluchač události, který čeká na stisk klávesy
    document.removeEventListener('keydown',priStiskuKlavesy)
    
    //Vymažeme dárky, které zůstaly na herní ploše
    odeberDarky();
  
    //Přepne na závěrečnou obrazovku
    prepniObrazovku('konec');
  
    //podle dosaženého výsledku vypíšeme hlášku
    if (hra.skore === 0) {
      hra.vysledek.textContent = 'Bohužel jsi nechytil žádný dárek. Ale snaha byla.';
    } else if (hra.skore === 1) {
      hra.vysledek.textContent = 'Zachránil jsi pouze 1 dárek, ale i ta jedna rozzářená dětská očička za to určitě stojí.';
    } else if (hra.skore < 5) {
      hra.vysledek.textContent = 'Chytil jsi' + hra.skore + 'darky. Mohlo to být lepší, ale určitě to zkusíš znovu, že ano?';
    } else {
      hra.vysledek.textContent = 'Výborně, chytil jsi' + hra.skore + 'dárků. Tolik dětí bude mít díky tobě radostné Vánoce';
    }
  }
  
  //Zobrazí čas ve formátu mm:ss v hlavičce hry
  function zobrazCas() {
    //Nechceme zobrazit čas menší než 0, pokud je čas menší než 0, nastavíme ho na 0
    if (hra.cas < 0) {
      hra.cas = 0;
    }
  
    //Z celkového počtu vteřin spočítáme minuty a vteřiny
    let minuty = Math.floor(hra.cas / 60);
    let vteriny = Math.floor(hra.cas - minuty * 60);
  
    //Převod spočítané minuty a vteřiny na formát mm:ss
    let naformatovanyCas = ('00' + minuty).slice(-2) + ':' + ('00' + vteriny).slice(-2)
  
    //Naformátovaný čas vypíšeme na obrazovku
    hra.casElement.textContent = naformatovanyCas;
  }
  
  function aktualizujCas() {
    //Odečteme od času 1/50 vteřiny
    hra.cas = hra.cas - 0.02;
  
    //Zobrazíme aktualizovaný čas
    zobrazCas();
  }
  
  //Odstraní všechny dárky z herní plochy při skončení hry
  function odeberDarky() {
    //Projdeme všechny dárky v seznamu
    for (let i=0; i<darky.length;i++) {
      //Smažeme z herní plochy jejich obrázky
      darky[i].element.remove()
    }
  
    //Vyprázdníme pole dárků
    darky = [];
  }