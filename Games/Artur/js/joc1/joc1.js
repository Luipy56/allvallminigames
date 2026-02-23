const fitxes = document.querySelectorAll('.fitxa');
const caixes = document.querySelectorAll('.caixa');
const feedback = document.getElementById('feedback');
const restart = document.getElementById('restart');

const calids=["vermell", "taronja", "groc"];
const freds=["blau", "violeta", "verd"];


fitxes.forEach(fitxa => {
    fitxa.draggable=true;

    fitxa.addEventListener('dragstart', (e) => {
        let targetId=e.target.id;

        if(calids.includes(targetId)){
            e.dataTransfer.setData('text', e.target.id);
            e.dataTransfer.setData('text2', 'calid');
        }
        else{
            e.dataTransfer.setData('text', e.target.id);
            e.dataTransfer.setData('text2', 'fred');
        }
       
    });
});


caixes.forEach(caixa => {

    /*-----------------------------------------*/
    caixa.addEventListener('dragover', (e) => {
        e.preventDefault();
        caixa.classList.add('drag-over');
    });

    caixa.addEventListener('dragleave', () => {
        caixa.classList.remove('drag-over');
    });
    /*-----------------------------------------*/


    caixa.addEventListener('drop', (e) => {
        e.preventDefault();
        caixa.classList.remove('drag-over');

        let idFitxa = e.dataTransfer.getData('text');
        let fitxa = document.getElementById(idFitxa);

        let colorCasella = e.dataTransfer.getData('text2');
        let casellaTipus = e.currentTarget.id;

        if (colorCasella === casellaTipus) {
            caixa.appendChild(fitxa);
            feedback.innerText = "✅ Correcte! ✅";
            feedback.style.color = "green";
        } else {
            feedback.innerText = "❌ Aquest color no va aquí! ❌";
            feedback.style.color = "red";
        }

        comprovaVictoria();
    });
});

restart.addEventListener('click', reiniciarJoc);


function comprovaVictoria() {
    const restants = document.querySelector('#origen');

    if (restants.innerHTML.trim() === "") {
        const popup = document.getElementById('popup-victoria');
        popup.classList.add('mostrar');
    }
}

function reiniciarJoc() {
    location.reload(); 
}