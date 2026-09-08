# Partnerské logá — opravený balík originálov

39 SVG súborov pre 38 odsúhlasených položiek. Schneider Electric a APC sú samostatne.

## Čo obsahuje tento balík

- `customers/`: 19 zákazníckych log.
- `technologies/`: 20 technologických log.
- `customers/masters/nitriansky-samospravny-kraj.eps`: nezmenený originálny EPS z oficiálneho balíka kraja.
- `technologies/masters/synology.ai`: nezmenený originálny sivý AI variant z oficiálneho brand balíka Synology.
- `manifest.csv`: zdroje, typ každého assetu, vykonaná technická extrakcia/konverzia a SHA-256.
- `preview.html`: vizuálny prehľad a odkazy na jednotlivé súbory aj ich zdroje.

## Presný stav formátov

**36 pôvodných vektorových SVG** stiahnutých ako hotové súbory alebo vybratých z oficiálneho webu. **2 SVG sú prevody pôvodných vektorových EPS/AI**: Nitriansky samosprávny kraj a Synology. Pri oboch sú priložené originálne master súbory; nejde o obkreslenie rastrov. **1 SVG obsahuje originálny vložený PNG**: SISME. Takto ho publikuje samotný výrobca na sisme.it; súbor je zachovaný bez úprav. SISME preto neoznačujeme za čistý vektor a jeho rozlíšenie zostáva obmedzené zdrojovým PNG 255 × 54.

V tomto balíku nie sú použité žiadne generované ani trasované náhrady log. Logá neboli prefarbené do sivej, deformované ani vyrezané z mockupu. Zachované sú pôvodné pomery strán, farby a plátna súborov. Prázdne okraje pôvodných podkladov ostali zachované.

## Konkrétne opravy oproti prvému ZIPu

- STANTER: pôvodné SVG dohľadané vo verejnej knižnici médií stanter.eu.
- Ubiquiti: pôvodné horizontálne SVG z oficiálneho brand ZIPu.
- Aruba: pôvodné SVG z oficiálnej vývojárskej dokumentácie.
- NSK: originálny EPS z oficiálnej sekcie Logá NSK a vektorový prevod do SVG; pôvodné rasterizované prekreslenie odstránené.
- SISME: obnovený nezmenený SVG súbor výrobcu vrátane jeho vloženého PNG.
- Microsoft: hotový pôvodný SVG zo servera Microsoft, nie výrez z PDF.
- Slovnaft: hotový pôvodný SVG zo stránky projektu Slovnaft BAjk, vrátane sloganu MEMBER OF MOL GROUP.
- Marel: hotový SVG publikovaný technologickým partnerom PTC, nie výrez z brožúry.
- Mühlbauer: verejná archívna SVG kópia s uvedeným pôvodným zdrojom od výrobcu, nie vlastný výrez z PDF.
- Lenovo: pôvodné horizontálne SVG z hlavičky lenovo.com, bez otáčania vertikálneho loga.
- Ostatné logá: obnovené zdrojové SVG pred grayscale úpravami z prvého balíka.

## Pôvod a identita

Mühlbauer je archívna kópia na Wikimedia Commons; zdrojová stránka uvádza odkaz na súbor výrobcu. Nie je vydávaná za aktuálny press kit. Marel je publikovaný na stránke partnera PTC. Slovnaft pochádza z projektu Slovnaft BAjk. Presné URL sú v manifeste.

Použitý je Agromont Nitra podľa regionálneho kontextu zoznamu a SISME Group, výrobca elektromotorov, ktorý má závod na Slovensku (https://sisme.it/en/sisme-slovakia/). Jaguar Land Rover je reprezentovaný korporátnym logom JLR. VMware je verzia by Broadcom a Aruba verzia HPE Aruba Networking.

SVG vložené priamo v HTML boli vybraté do samostatného súboru. Cesty ostali zachované; pri `currentColor` alebo farbe zdedenej z externého CSS treba v integrácii zachovať zvolený farebný kontext. Nejde o samostatné súbory z press kitu; manifest to rozlišuje.

## Použitie vo frontende

Zobraziť cez `<img>` so zachovaním pomeru strán (`object-fit: contain`). Transparentné pozadie nevylučuje plochu, ktorá je súčasťou samotného loga, napríklad červenú plochu Lenovo alebo modro-žltú plochu IKEA. Biele varianty Telekom, Foxconn, HPE, Sophos a Omada potrebujú tmavé pozadie. SVG podklady samy nepremaľovávať; ak má pás zobrazovať grayscale, možno použiť prezentačný CSS filter, pričom zdrojové súbory zostanú zachované.

Náhľad používa vykreslené obrázky so zmenšenými prázdnymi okrajmi iba pre prehľadnosť. Zdrojové SVG neboli týmto spôsobom orezané. Odkaz Otvoriť SVG ukazuje skutočný súbor.

Overenie: všetkých 39 SVG sa úspešne vykreslilo; skontrolované vizuálne. V 38 súboroch nie sú vložené rastrové obrázky, SISME je označená výnimka. Originálne EPS/AI zostali nezmenené. Zdrojové cesty a farby vektorových prevodov neboli ručne upravované.
