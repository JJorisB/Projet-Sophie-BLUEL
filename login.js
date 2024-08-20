const loginButton = document.getElementById("login-button");

const login = async () => {
  const emailValue = document.getElementById("login-email").value;
  const passwordValue = document.getElementById("login-password").value;
  const errorMessage = document.getElementById("error-message");

  console.log(emailValue, passwordValue);

  //Étape 3.2 : Authentification de l’utilisateur
  try {
    const response = await fetch("http://localhost:5678/api/users/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email: emailValue, password: passwordValue }),
    });

    const { error, message, token } = await response.json();

    if (error || message) {
      errorMessage.style.display = "block";
      errorMessage.innerText = message || "Une erreur est survenue";
      console.log(error, message);
    } else if (token) {
      localStorage.setItem("accessToken", token);
      window.location.href = "index.html";
    }
  } catch (err) {
    errorMessage.style.display = "block";
    errorMessage.innerText =
      "Une erreur est survenue lors de la connexion. Veuillez réessayer.";
    console.log(err);
  }
};

loginButton.addEventListener("click", login);
