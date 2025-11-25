const loginForm = document.getElementById('loginForm');

loginForm.addEventListener('submit', (e) => {
    e.preventDefault();

    const username = document.getElementById('username').value;
    
    if (username.trim() !== "") {
        localStorage.setItem('currentUser', username);
        localStorage.setItem('isLoggedIn', 'true');
        window.location.href = 'index.html'; 
    } else {
        alert("กรุณากรอกชื่อก่อนน้า!");
    }
});