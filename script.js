// Base de données des animaux avec leurs caractéristiques
const animals = [
    { emoji: '🦁', name: 'Lion', description: 'Tu es un leader naturel, courageux et protecteur de tes proches !' },
    { emoji: '🐼', name: 'Panda', description: 'Tu es calme, sage et tu apportes la paix autour de toi !' },
    { emoji: '🦅', name: 'Aigle', description: 'Tu as une vision claire, tu es ambitieux et tu vises toujours haut !' },
    { emoji: '🐺', name: 'Loup', description: 'Tu es loyal, intelligent et tu travailles bien en équipe !' },
    { emoji: '🦊', name: 'Renard', description: 'Tu es rusé, adaptable et plein de charme naturel !' },
    { emoji: '🐘', name: 'Éléphant', description: 'Tu as une excellente mémoire, tu es sage et bienveillant !' },
    { emoji: '🐯', name: 'Tigre', description: 'Tu es indépendant, passionné et tu as une force intérieure impressionnante !' },
    { emoji: '🦋', name: 'Papillon', description: 'Tu es créatif, libre et tu inspires la transformation chez les autres !' },
    { emoji: '🐧', name: 'Pingouin', description: 'Tu es social, fidèle et tu gardes ton sang-froid en toute situation !' },
    { emoji: '🦜', name: 'Perroquet', description: 'Tu es expressif, coloré et tu apportes de la joie partout où tu passes !' }
];

// Base de données des matières
const materials = [
    { icon: '🪨', name: 'Marbre', description: 'Élégant et intemporel, tu as une beauté naturelle !' },
    { icon: '🌟', name: 'Cristal', description: 'Transparent et brillant, tu reflétes la lumière autour de toi !' },
    { icon: '🔥', name: 'Métal', description: 'Solide et résistant, tu es fiable dans toutes les situations !' },
    { icon: '🌿', name: 'Bois', description: 'Naturel et chaleureux, tu apportes du réconfort !' },
    { icon: '💎', name: 'Diamant', description: 'Précieux et étincelant, tu es unique et rare !' },
    { icon: '🌊', name: 'Verre', description: 'Délicat mais fort, tu as une beauté fragile et pure !' },
    { icon: '🏔️', name: 'Pierre', description: 'Stable et éternel, tu es un pilier pour les autres !' },
    { icon: '✨', name: 'Soie', description: 'Doux et raffiné, tu as une élégance naturelle !' }
];

// Variables pour la gestion des données
let githubData = {};
let uploadedPhoto = null;

// Éléments du DOM
const welcomeScreen = document.getElementById('welcome-screen');
const formScreen = document.getElementById('form-screen');
const resultScreen = document.getElementById('result-screen');
const startBtn = document.getElementById('start-btn');
const userForm = document.getElementById('user-form');
const shareBtn = document.getElementById('share-btn');
const restartBtn = document.getElementById('restart-btn');
const photoInput = document.getElementById('photo-input');
const photoDropZone = document.getElementById('photo-drop-zone');
const photoPreview = document.getElementById('photo-preview');
const materialResult = document.getElementById('material-result');

// Navigation entre les écrans
function showScreen(targetScreen) {
    document.querySelectorAll('.screen').forEach(screen => {
        screen.classList.remove('active');
    });
    
    setTimeout(() => {
        targetScreen.classList.add('active');
    }, 200);
}

// Fonction pour calculer l'animal basé sur le nom et l'âge
function calculateAnimal(name, age) {
    // Algorithme simple : on utilise la somme des codes ASCII du nom + l'âge
    let nameValue = 0;
    for (let i = 0; i < name.length; i++) {
        nameValue += name.charCodeAt(i);
    }
    
    const totalValue = nameValue + parseInt(age);
    const animalIndex = totalValue % animals.length;
    
    return animals[animalIndex];
}

// Fonction pour charger les données depuis GitHub
async function loadGithubData() {
    try {
        // Remplace cette URL par ton dépôt GitHub réel
        const response = await fetch('https://raw.githubusercontent.com/username/repo/main/users-data.json');
        if (response.ok) {
            githubData = await response.json();
            console.log('Données GitHub chargées:', githubData);
        }
    } catch (error) {
        console.log('Impossible de charger les données GitHub:', error);
        // Données de fallback
        githubData = {
            users: [
                { nom: 'Dupont', prenom: 'Marie', animal: 'Lion' },
                { nom: 'Martin', prenom: 'Pierre', animal: 'Panda' }
            ]
        };
    }
}

// Fonction pour calculer la matière basée sur l'image
function calculateMaterial(imageData) {
    // Simulation d'analyse d'image - dans la réalité, tu utiliserais une API d'IA
    const brightness = calculateImageBrightness(imageData);
    const materialIndex = Math.floor(brightness * materials.length);
    return materials[materialIndex] || materials[0];
}

// Fonction pour calculer la luminosité moyenne d'une image
function calculateImageBrightness(imageData) {
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    canvas.width = imageData.width;
    canvas.height = imageData.height;
    
    ctx.drawImage(imageData, 0, 0);
    const data = ctx.getImageData(0, 0, canvas.width, canvas.height).data;
    
    let brightness = 0;
    for (let i = 0; i < data.length; i += 4) {
        brightness += (data[i] + data[i + 1] + data[i + 2]) / 3;
    }
    
    return (brightness / (data.length / 4)) / 255;
}

// Fonction pour afficher le résultat
function showResult(name, age) {
    const animal = calculateAnimal(name, age);
    
    document.getElementById('animal-emoji').textContent = animal.emoji;
    document.getElementById('animal-name').textContent = animal.name;
    document.getElementById('animal-description').textContent = animal.description;
    
    // Stocker les données pour le partage
    sessionStorage.setItem('userName', name);
    sessionStorage.setItem('userAge', age);
    sessionStorage.setItem('userAnimal', JSON.stringify(animal));
    
    // Afficher la matière si une photo a été uploadée
    if (uploadedPhoto) {
        const material = calculateMaterial(uploadedPhoto);
        document.getElementById('material-icon').textContent = material.icon;
        document.getElementById('material-name').textContent = material.name;
        document.getElementById('material-description').textContent = material.description;
        materialResult.style.display = 'block';
        
        // Stocker la matière pour le partage
        sessionStorage.setItem('userMaterial', JSON.stringify(material));
    }
    
    // Vérifier dans les données GitHub
    if (githubData.users) {
        const githubUser = githubData.users.find(user => 
            user.prenom.toLowerCase() === name.toLowerCase()
        );
        if (githubUser) {
            console.log('Utilisateur trouvé dans GitHub:', githubUser);
            // Tu peux utiliser ces données comme tu le souhaites
        }
    }
    
    showScreen(resultScreen);
}

// Fonction pour générer un lien de partage
function generateShareLink(name, age) {
    const baseUrl = window.location.origin + window.location.pathname;
    const params = new URLSearchParams({
        name: name,
        age: age,
        shared: 'true'
    });
    
    return `${baseUrl}?${params.toString()}`;
}

// Fonction pour partager
async function shareResult() {
    const name = sessionStorage.getItem('userName');
    const age = sessionStorage.getItem('userAge');
    const animal = JSON.parse(sessionStorage.getItem('userAnimal'));
    const material = sessionStorage.getItem('userMaterial') ? 
        JSON.parse(sessionStorage.getItem('userMaterial')) : null;
    
    const shareLink = generateShareLink(name, age);
    let shareText = `Je suis ${animal.name} ${animal.emoji} !`;
    
    if (material) {
        shareText += ` Ma matière est ${material.name} ${material.icon} !`;
    }
    
    shareText += ' Découvre quel animal tu es :';
    
    if (navigator.share) {
        try {
            await navigator.share({
                title: 'Quel Animal Es-Tu ?',
                text: shareText,
                url: shareLink
            });
        } catch (err) {
            console.log('Partage annulé');
        }
    } else {
        // Fallback : copier le lien
        try {
            await navigator.clipboard.writeText(shareLink);
            showNotification('Lien copié dans le presse-papiers !');
        } catch (err) {
            // Fallback pour les navigateurs plus anciens
            const textArea = document.createElement('textarea');
            textArea.value = shareLink;
            document.body.appendChild(textArea);
            textArea.select();
            document.execCommand('copy');
            document.body.removeChild(textArea);
            showNotification('Lien copié dans le presse-papiers !');
        }
    }
}

// Fonction pour afficher une notification
function showNotification(message) {
    const notification = document.createElement('div');
    notification.textContent = message;
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: #4CAF50;
        color: white;
        padding: 12px 24px;
        border-radius: 8px;
        z-index: 1000;
        font-weight: 600;
        box-shadow: 0 4px 12px rgba(0,0,0,0.15);
        transform: translateX(100%);
        transition: transform 0.3s ease;
    `;
    
    document.body.appendChild(notification);
    
    setTimeout(() => {
        notification.style.transform = 'translateX(0)';
    }, 100);
    
    setTimeout(() => {
        notification.style.transform = 'translateX(100%)';
        setTimeout(() => {
            document.body.removeChild(notification);
        }, 300);
    }, 3000);
}

// Gestionnaires pour l'upload de photo
photoDropZone.addEventListener('click', () => {
    photoInput.click();
});

photoDropZone.addEventListener('dragover', (e) => {
    e.preventDefault();
    photoDropZone.classList.add('dragover');
});

photoDropZone.addEventListener('dragleave', () => {
    photoDropZone.classList.remove('dragover');
});

photoDropZone.addEventListener('drop', (e) => {
    e.preventDefault();
    photoDropZone.classList.remove('dragover');
    const files = e.dataTransfer.files;
    if (files.length > 0) {
        handlePhotoUpload(files[0]);
    }
});

photoInput.addEventListener('change', (e) => {
    if (e.target.files.length > 0) {
        handlePhotoUpload(e.target.files[0]);
    }
});

function handlePhotoUpload(file) {
    if (!file.type.startsWith('image/')) {
        showNotification('Veuillez sélectionner une image valide');
        return;
    }
    
    const reader = new FileReader();
    reader.onload = (e) => {
        const img = new Image();
        img.onload = () => {
            uploadedPhoto = img;
            photoPreview.src = e.target.result;
            photoPreview.style.display = 'block';
            photoDropZone.querySelector('.photo-placeholder').style.display = 'none';
            showNotification('Photo uploadée avec succès !');
        };
        img.src = e.target.result;
    };
    reader.readAsDataURL(file);
}

// Gestionnaires d'événements
startBtn.addEventListener('click', () => {
    showScreen(formScreen);
});

userForm.addEventListener('submit', (e) => {
    e.preventDefault();
    
    const name = document.getElementById('name').value.trim();
    const age = document.getElementById('age').value;
    
    if (name && age) {
        showResult(name, age);
    }
});

shareBtn.addEventListener('click', shareResult);

restartBtn.addEventListener('click', () => {
    userForm.reset();
    uploadedPhoto = null;
    photoPreview.style.display = 'none';
    photoDropZone.querySelector('.photo-placeholder').style.display = 'block';
    materialResult.style.display = 'none';
    
    // Remettre le titre original
    document.querySelector('#result-screen h2').textContent = 'Ton animal spirituel est...';
    // Remettre le texte original du bouton
    document.getElementById('restart-btn').textContent = '🔄 Recommencer';
    
    showScreen(welcomeScreen);
});

// Charger les données GitHub au démarrage
window.addEventListener('load', () => {
    loadGithubData();
    
    const urlParams = new URLSearchParams(window.location.search);
    const sharedName = urlParams.get('name');
    const sharedAge = urlParams.get('age');
    const isShared = urlParams.get('shared');
    
    if (isShared && sharedName && sharedAge) {
        // Afficher directement le résultat de la personne qui a partagé
        const animal = calculateAnimal(sharedName, sharedAge);
        
        // Mettre à jour l'écran de résultat avec les données partagées
        document.getElementById('animal-emoji').textContent = animal.emoji;
        document.getElementById('animal-name').textContent = animal.name;
        document.getElementById('animal-description').textContent = animal.description;
        
        // Modifier le titre pour montrer qui a partagé
        document.querySelector('#result-screen h2').textContent = `${sharedName} est ${animal.name} ${animal.emoji} !`;
        
        // Stocker les données
        sessionStorage.setItem('userName', sharedName);
        sessionStorage.setItem('userAge', sharedAge);
        sessionStorage.setItem('userAnimal', JSON.stringify(animal));
        
        // Cacher la matière puisqu'on n'a pas la photo
        materialResult.style.display = 'none';
        
        // Modifier le texte du bouton restart pour encourager à essayer
        document.getElementById('restart-btn').textContent = '🎯 À mon tour !';
        
        // Afficher l'écran de résultat
        showScreen(resultScreen);
        
        // Nettoyer l'URL après 3 secondes
        setTimeout(() => {
            window.history.replaceState({}, document.title, window.location.pathname);
        }, 3000);
    }
});