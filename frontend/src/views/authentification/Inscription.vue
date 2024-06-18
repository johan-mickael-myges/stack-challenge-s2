<template>
    <div class="formulaire">
      <form @submit.prevent="register" class="form-container">
        <h2>Inscription</h2>
  
        <div class="form-group">
          <label for="firstname">Prénom</label>
          <input type="text" id="firstname" v-model="firstname" required>
        </div>
  
        <div class="form-group">
          <label for="lastname">Nom</label>
          <input type="text" id="lastname" v-model="lastname" required>
        </div>
  
        <div class="form-group">
          <label for="number">Numéro de téléphone</label>
          <input type="text" id="number" v-model="number" required>
        </div>
  
        <div class="form-group">
          <label for="email">Email</label>
          <input type="email" id="email" v-model="email" required>
        </div>
  
        <div class="form-group">
          <label for="password">Mot de passe</label>
          <input type="password" id="password" v-model="password" required>
        </div>
  
        <button type="submit">S'inscrire</button>
      </form>
  
      <p v-if="errorMessage" class="error-message">{{ errorMessage }}</p>
    </div>
  </template>
  
  <script setup lang="ts">
  import { ref } from 'vue';
  
  const firstname = ref('');
  const lastname = ref('');
  const number = ref('');
  const email = ref('');
  const password = ref('');
  const errorMessage = ref('');
  
  const register = async () => {
    try {
      const response = await fetch('http://localhost:8000/api/register', { 
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          firstname: firstname.value,
          lastname: lastname.value,
          number: number.value,
          email: email.value,
          password: password.value,
        }),
      });
  
      const data = await response.json();
      if (response.ok) {
        alert('Inscription réussie !');
        resetFields();
      } else {
        errorMessage.value = data.message || 'Une erreur s\'est produite lors de l\'inscription';
      }
    } catch (error : any ) {
      errorMessage.value = error.message || 'Une erreur s\'est produite lors de l\'inscription';
    }
  };
  
  const resetFields = () => {
    firstname.value = '';
    lastname.value = '';
    number.value = '';
    email.value = '';
    password.value = '';
  };
  </script>
  
  <style scoped>
  .formulaire {
    margin-top: 50px;
    display: flex;
    justify-content: center;
    align-items: center;
  }
  
  .form-container {
    width: 400px;
    padding: 20px;
    background-color: #f2f2f2;
    border-radius: 8px;
    box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
  }
  
  .form-container h2 {
    text-align: center;
    margin-bottom: 20px;
  }
  
  .form-group {
    margin-bottom: 15px;
  }
  
  .form-group label {
    font-weight: bold;
  }
  
  .form-group input {
    width: 100%;
    padding: 8px;
    font-size: 16px;
    border: 1px solid #ccc;
    border-radius: 4px;
  }
  
  .form-group input:focus {
    outline: none;
    border-color: #007bff;
  }
  
  button {
    width: 100%;
    padding: 10px;
    font-size: 16px;
    background-color: #007bff;
    color: white;
    border: none;
    border-radius: 4px;
    cursor: pointer;
  }
  
  button:hover {
    background-color: #0056b3;
  }
  
  .error-message {
    color: red;
    margin-top: 10px;
    text-align: center;
  }
  </style>
  