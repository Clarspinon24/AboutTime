    // ============================================================
    //  UI
    // ============================================================

    const now   = new Date();
    const later = new Date(now.getTime() + 3 * 86400000);
    const fmt   = d => d.toISOString().slice(0, 10);
    document.getElementById('dt1').value = fmt(now);
    document.getElementById('dt2').value = fmt(later);

    function gv(id) { return parseInt(document.getElementById(id).value) || 0; }

    function showResult(id, val, note) {
      document.getElementById(id).classList.add('show');
      document.getElementById(id + '-val').textContent  = val;
      document.getElementById(id + '-note').textContent = note || '';
    }

    function doAdd(op) {
      const r = addSubtractTime(gv('s-h'), gv('s-m'), gv('s-s'), gv('d-h'), gv('d-m'), gv('d-s'), op);
      showResult('res-add', r.result, r.overflowLabel);
    }

    function doElapsed() {
      const r = elapsedTime(gv('e1-h'), gv('e1-m'), gv('e1-s'), gv('e2-h'), gv('e2-m'), gv('e2-s'));
      showResult('res-elapsed', r.result, r.nextDay ? '(passage minuit — fin le lendemain)' : '');
    }

    function doDateDiff() {
      const r = dateDiff(document.getElementById('dt1').value, document.getElementById('dt2').value);
      if (r.error) { alert(r.error); return; }
      const note = r.negative
        ? 'La date de fin est avant la date de début'
        : `soit ${r.totalDays} jour${r.totalDays > 1 ? 's' : ''} au total`;
      showResult('res-date', r.result, note);
    }
      const calcul = document.getElementById("btn_calcul")
      const travail = document.getElementById("btn_travail")

      const allSection = document.querySelectorAll(".section");
    function showSection(id) {
      // Cache l'accueil dès qu'on clique sur un onglet
      document.getElementById('accueil').style.display = 'none';

      allSection.forEach(sec => sec.classList.remove("visible"));
      const target = document.getElementById(id);
      target.classList.add("visible");
    }

      calcul.addEventListener("click", () => showSection("section_calcul"));
      travail.addEventListener("click", () => showSection("section_travail"));
     
    // ============================================================
    // Historique Semaine - Mise à jour de la table avec le pointage
    // ============================================================
    
    function obtenirJourSemaine(dateStr) {
      // dateStr format: "17/04/2026" ou même format
      const jours = ['dimanche', 'lundi', 'mardi', 'mercredi', 'jeudi', 'vendredi', 'samedi'];
      const parts = dateStr.split('/');
      const date = new Date(parts[2], parts[1] - 1, parts[0]); // Y, M, D
      return jours[date.getDay()];
    }

    function mettreAJourTableHistorique() {
      const historique = JSON.parse(localStorage.getItem('pointage_travail') || '{}');
      
      Object.entries(historique).forEach(([dateStr, infos]) => {
        const jour = obtenirJourSemaine(dateStr);
        
        // Vérifier que le jour existe dans la table
        const row = document.querySelector(`tr[data-jour="${jour}"]`);
        if (!row) return;
        
        const spanArrivee = row.querySelector('span.heure-arrivee');
        const spanDepart = row.querySelector('span.heure-depart');
        const spanDuree = row.querySelector('span.duree-calculee');
        
        if (infos.arrivee) {
          spanArrivee.textContent = infos.arrivee;
        }
        if (infos.depart) {
          spanDepart.textContent = infos.depart;
        }
        
        // Calculer la durée
        if (infos.arrivee && infos.depart) {
          const [aH, aM] = infos.arrivee.split(':').map(Number);
          const [dH, dM] = infos.depart.split(':').map(Number);
          
          let diffMinutes = (dH * 60 + dM) - (aH * 60 + aM);
          if (diffMinutes < 0) {
            diffMinutes += 24 * 60;
          }
          
          const heures = Math.floor(diffMinutes / 60);
          const minutes = diffMinutes % 60;
          spanDuree.textContent = `${heures}h ${minutes.toString().padStart(2, '0')}min`;
        } else {
          spanDuree.textContent = '-';
        }
      });
    }

    // Mettre à jour la table au démarrage
    mettreAJourTableHistorique();
    
    // Écouter les changements dans localStorage pour mettre à jour la table dynamiquement
    window.addEventListener('storage', () => {
      mettreAJourTableHistorique();
    });
     

  if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
      navigator.serviceWorker.register('./sw.js')
        .then(reg => console.log('Service Worker enregistré !', reg))
        .catch(err => console.warn('Erreur de Service Worker', err));
    });
  }