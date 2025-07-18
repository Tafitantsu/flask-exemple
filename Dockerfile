# Étape 1 : choisir une image de base avec Python
FROM python:3.11-slim

# Étape 2 : définir le dossier de travail dans le conteneur
WORKDIR /app

# Étape 3 : copier les fichiers requis
COPY requirements.txt .

# Étape 4 : installer les dépendances
RUN pip install --no-cache-dir -r requirements.txt

# Étape 5 : copier le code de l'application
COPY . .

# Étape 6 : exposer le port Flask
EXPOSE 5000

# Étape 7 : lancer l'application Flask
CMD ["python", "app.py"]
