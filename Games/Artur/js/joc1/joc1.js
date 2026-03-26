const fitxes = document.querySelectorAll('.fitxa');
const caixes = document.querySelectorAll('.caixa');
const feedback = document.getElementById('feedback');
const restart = document.getElementById('restart');

const calids = ["foc", "desert", "volca"];
const freds = ["floquetDeNeu", "gel", "ninot"];

function tipusFitxa(id) {
    if (calids.includes(id)) return 'calid';
    if (freds.includes(id)) return 'fred';
    return null;
}

function clearDragStyles(el) {
    el.style.position = '';
    el.style.left = '';
    el.style.top = '';
    el.style.width = '';
    el.style.height = '';
    el.style.zIndex = '';
    el.style.touchAction = '';
}

function elementUnderPoint(clientX, clientY, dragEl) {
    const prev = dragEl.style.pointerEvents;
    dragEl.style.pointerEvents = 'none';
    const under = document.elementFromPoint(clientX, clientY);
    dragEl.style.pointerEvents = prev;
    return under;
}

function clearCaixaOver() {
    caixes.forEach(c => c.classList.remove('drag-over'));
}

let drag = null;

fitxes.forEach(fitxa => {
    fitxa.draggable = false;

    fitxa.addEventListener('pointerdown', (e) => {
        if (e.button !== 0) return;
        e.preventDefault();
        try {
            fitxa.setPointerCapture(e.pointerId);
        } catch (_) {}

        const r = fitxa.getBoundingClientRect();
        drag = {
            el: fitxa,
            pointerId: e.pointerId,
            offsetX: e.clientX - r.left,
            offsetY: e.clientY - r.top,
            parent: fitxa.parentNode,
            next: fitxa.nextSibling,
        };

        fitxa.style.position = 'fixed';
        fitxa.style.left = r.left + 'px';
        fitxa.style.top = r.top + 'px';
        fitxa.style.width = r.width + 'px';
        fitxa.style.height = r.height + 'px';
        fitxa.style.zIndex = '10000';
        fitxa.style.touchAction = 'none';
    });

    fitxa.addEventListener('pointermove', (e) => {
        if (!drag || drag.el !== fitxa || drag.pointerId !== e.pointerId) return;
        e.preventDefault();
        fitxa.style.left = e.clientX - drag.offsetX + 'px';
        fitxa.style.top = e.clientY - drag.offsetY + 'px';

        clearCaixaOver();
        const under = elementUnderPoint(e.clientX, e.clientY, fitxa);
        const caixa = under && under.closest('.caixa');
        if (caixa) caixa.classList.add('drag-over');
    });

    function endDrag(e) {
        if (!drag || drag.el !== fitxa || drag.pointerId !== e.pointerId) return;
        e.preventDefault();
        if (fitxa.hasPointerCapture(e.pointerId)) {
            fitxa.releasePointerCapture(e.pointerId);
        }
        clearCaixaOver();

        const idFitxa = fitxa.id;
        const tipusCasella = tipusFitxa(idFitxa);
        const under = elementUnderPoint(e.clientX, e.clientY, fitxa);
        const caixa = under && under.closest('.caixa');

        let ok = false;
        if (caixa && tipusCasella && tipusCasella === caixa.id) {
            caixa.appendChild(fitxa);
            feedback.innerText = '✅ Correcte! ✅';
            feedback.style.color = 'green';
            ok = true;
            comprovaVictoria();
        } else if (caixa) {
            feedback.innerText = '❌ Aquest color no va aquí! ❌';
            feedback.style.color = 'red';
        }

        if (!ok) {
            drag.parent.insertBefore(fitxa, drag.next);
        }
        clearDragStyles(fitxa);
        drag = null;
    }

    fitxa.addEventListener('pointerup', endDrag);
    fitxa.addEventListener('pointercancel', endDrag);
});

restart.addEventListener('click', reiniciarJoc);

function comprovaVictoria() {
    const restants = document.querySelector('#origen');

    if (restants.innerHTML.trim() === '') {
        const popup = document.getElementById('popup-victoria');
        popup.classList.add('mostrar');
    }
}

function reiniciarJoc() {
    location.reload();
}
