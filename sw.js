// Service Worker for offline use

const CACHE_NAME = '2.2.0';
const CACHE_LIST = '/,gallery.html,manifest.json,https://fonts.googleapis.com/css2?family=Alexandria:wght@500&family=Open+Sans&display=swap,https://fonts.gstatic.com/s/opensans/v34/memSYaGs126MiZpBA-UvWbX2vVnXBbObj2OVZyOOSr4dVJWUgsjZ0B4gaVI.woff2,fontawesome/css/fontawesome.min.css,fontawesome/css/solid.css,fontawesome/webfonts/fa-solid-900.woff2,fontawesome/webfonts/fa-solid-900.ttf,icons/android-chrome-192x192.png,icons/android-chrome-512x512.png,icons/apple-touch-icon.png,icons/favicon-16x16.png,icons/favicon-32x32.png,icons/favicon.ico,data/easy-opt.json,data/expert-opt.json,data/normal-opt.json,data/us-states-opt.json,css/gallery.css,css/global.css,css/shift-away-subtle.css,css/tippy.css,dist/main.js,flags/AD.svg,flags/AE.svg,flags/AF.svg,flags/AG.svg,flags/AI.svg,flags/AL.svg,flags/AM.svg,flags/AO.svg,flags/AR.svg,flags/AS.svg,flags/AT.svg,flags/AU.svg,flags/AW.svg,flags/AX.svg,flags/AZ.svg,flags/BA.svg,flags/BB.svg,flags/BD.svg,flags/BE.svg,flags/BF.svg,flags/BG.svg,flags/BH.svg,flags/BI.svg,flags/BJ.svg,flags/BL.svg,flags/BM.svg,flags/BN.svg,flags/BO.svg,flags/BQ.svg,flags/BR.svg,flags/BS.svg,flags/BT.svg,flags/BV.svg,flags/BW.svg,flags/BY.svg,flags/BZ.svg,flags/CA.svg,flags/CC.svg,flags/CD.svg,flags/CF.svg,flags/CG.svg,flags/CH.svg,flags/CI.svg,flags/CK.svg,flags/CL.svg,flags/CM.svg,flags/CN.svg,flags/CO.svg,flags/CR.svg,flags/CU.svg,flags/CV.svg,flags/CW.svg,flags/CX.svg,flags/CY.svg,flags/CZ.svg,flags/DE.svg,flags/DJ.svg,flags/DK.svg,flags/DM.svg,flags/DO.svg,flags/DZ.svg,flags/EC.svg,flags/EE.svg,flags/EG.svg,flags/EH.svg,flags/ENGLAND.svg,flags/ER.svg,flags/ES.svg,flags/ET.svg,flags/FI.svg,flags/FJ.svg,flags/FK.svg,flags/FM.svg,flags/FO.svg,flags/FR.svg,flags/GA.svg,flags/GB.svg,flags/GD.svg,flags/GE.svg,flags/GF.svg,flags/GG.svg,flags/GH.svg,flags/GI.svg,flags/GL.svg,flags/GM.svg,flags/GN.svg,flags/GP.svg,flags/GQ.svg,flags/GR.svg,flags/GS.svg,flags/GT.svg,flags/GU.svg,flags/GW.svg,flags/GY.svg,flags/HK.svg,flags/HM.svg,flags/HN.svg,flags/HR.svg,flags/HT.svg,flags/HU.svg,flags/ID.svg,flags/IE.svg,flags/IL.svg,flags/IM.svg,flags/IN.svg,flags/IO.svg,flags/IQ.svg,flags/IR.svg,flags/IS.svg,flags/IT.svg,flags/JE.svg,flags/JM.svg,flags/JO.svg,flags/JP.svg,flags/KE.svg,flags/KG.svg,flags/KH.svg,flags/KI.svg,flags/KM.svg,flags/KN.svg,flags/KP.svg,flags/KR.svg,flags/KW.svg,flags/KY.svg,flags/KZ.svg,flags/LA.svg,flags/LB.svg,flags/LC.svg,flags/LI.svg,flags/LK.svg,flags/LR.svg,flags/LS.svg,flags/LT.svg,flags/LU.svg,flags/LV.svg,flags/LY.svg,flags/MA.svg,flags/MC.svg,flags/MD.svg,flags/ME.svg,flags/MF.svg,flags/MG.svg,flags/MH.svg,flags/MK.svg,flags/ML.svg,flags/MM.svg,flags/MN.svg,flags/MO.svg,flags/MP.svg,flags/MQ.svg,flags/MR.svg,flags/MS.svg,flags/MT.svg,flags/MU.svg,flags/MV.svg,flags/MW.svg,flags/MX.svg,flags/MY.svg,flags/MZ.svg,flags/NA.svg,flags/NC.svg,flags/NE.svg,flags/NF.svg,flags/NG.svg,flags/NI.svg,flags/NL.svg,flags/NO.svg,flags/NP.svg,flags/NR.svg,flags/NU.svg,flags/NZ.svg,flags/OM.svg,flags/PA.svg,flags/PE.svg,flags/PF.svg,flags/PG.svg,flags/PH.svg,flags/PK.svg,flags/PL.svg,flags/PM.svg,flags/PN.svg,flags/PR.svg,flags/PS.svg,flags/PT.svg,flags/PW.svg,flags/PY.svg,flags/QA.svg,flags/RE.svg,flags/RO.svg,flags/RS.svg,flags/RU.svg,flags/RW.svg,flags/SA.svg,flags/SB.svg,flags/SC.svg,flags/SCOTLAND.svg,flags/SD.svg,flags/SE.svg,flags/SG.svg,flags/SH.svg,flags/SI.svg,flags/SJ.svg,flags/SK.svg,flags/SL.svg,flags/SM.svg,flags/SN.svg,flags/SO.svg,flags/SR.svg,flags/SS.svg,flags/ST.svg,flags/SV.svg,flags/SX.svg,flags/SY.svg,flags/SZ.svg,flags/TC.svg,flags/TD.svg,flags/TF.svg,flags/TG.svg,flags/TH.svg,flags/TJ.svg,flags/TK.svg,flags/TL.svg,flags/TM.svg,flags/TN.svg,flags/TO.svg,flags/TR.svg,flags/TT.svg,flags/TV.svg,flags/TW.svg,flags/TZ.svg,flags/UA.svg,flags/UG.svg,flags/US.svg,flags/UY.svg,flags/UZ.svg,flags/VA.svg,flags/VC.svg,flags/VE.svg,flags/VG.svg,flags/VI.svg,flags/VN.svg,flags/VU.svg,flags/WALES.svg,flags/WF.svg,flags/WS.svg,flags/XK.svg,flags/YE.svg,flags/YT.svg,flags/ZA.svg,flags/ZM.svg,flags/ZW.svg,flags/state,flags/state/alabama.png,flags/state/alaska.png,flags/state/arizona.png,flags/state/arkansas.png,flags/state/california.png,flags/state/colorado.png,flags/state/connecticut.png,flags/state/delaware.png,flags/state/florida.png,flags/state/georgia.png,flags/state/hawaii.png,flags/state/idaho.png,flags/state/illinois.png,flags/state/indiana.png,flags/state/iowa.png,flags/state/kansas.png,flags/state/kentucky.png,flags/state/louisiana.png,flags/state/maine.png,flags/state/maryland.png,flags/state/massachusetts.png,flags/state/michigan.png,flags/state/minnesota.png,flags/state/mississippi.png,flags/state/missouri.png,flags/state/montana.png,flags/state/nebraska.png,flags/state/nevada.png,flags/state/new-hampshire.png,flags/state/new-jersey.png,flags/state/new-mexico.png,flags/state/new-york.png,flags/state/north-carolina.png,flags/state/north-dakota.png,flags/state/ohio.png,flags/state/oklahoma.png,flags/state/oregon.png,flags/state/pennsylvania.png,flags/state/rhode-island.png,flags/state/seals,flags/state/south-carolina.png,flags/state/south-dakota.png,flags/state/tennessee.png,flags/state/texas.png,flags/state/utah.png,flags/state/vermont.png,flags/state/virginia.png,flags/state/washington.png,flags/state/west-virginia.png,flags/state/wisconsin.png,flags/state/wyoming.png'.split(",")

self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => cache.addAll(CACHE_LIST))
  );
});

self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys()
      .then(cacheNames => {
        return Promise.all(
          cacheNames.map(cacheName => {
            if (CACHE_NAME !== cacheName) {
              return caches.delete(cacheName);
            }
          })
        );
      })
  );
});

self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request)
      .then(response => {
        if (response) {
          return response;
        }

        const fetchRequest = event.request.clone();

        return fetch(fetchRequest).then(response => {
          if (!response || response.status !== 200 || response.type !== 'basic') {
            return response;
          }

          const responseToCache = response.clone();

          caches.open(CACHE_NAME)
            .then(cache => cache.put(event.request, responseToCache));

          return response;
        });
      })
  );
});
