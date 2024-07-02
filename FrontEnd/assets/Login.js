const loginButton = document.getElementById('login-button');

const login = async () => {
    const emailValue = document.getElementById('email-field').value;
    const passwordValue = document.getElementById('password-field').value;
    const response = await fetch('http://localhost:5678/api/users/login', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ email: emailValue, password: passwordValue })
    });
    const { error, message, token } = await response.json();
    if (error || message) {
        console.log(error, message);
    } else if (token) {
        localStorage.setItem('accessToken', token);
        window.location.href = 'index.html';
    }
}

loginButton.addEventListener('click', login);