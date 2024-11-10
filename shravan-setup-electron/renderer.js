async function login() {
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    const output = await window.shravanAPI.runshravanCommand(`login ${email} ${password}`);
    document.getElementById('output').textContent = output;
  }
  
  async function startshravan() {
    const output = await window.shravanAPI.runshravanCommand('start');
    document.getElementById('output').textContent = output;
  }
  