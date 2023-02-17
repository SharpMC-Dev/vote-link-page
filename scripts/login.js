const usernameInputError = $('label[for="username"]');
const usernameButton = $('#usernameSubmit');
const usernameInput = $('#usernameInput');
const currentUser = window.localStorage.getItem('username');

if (!currentUser) {
  $('.logout').hide();
  usernameInputError.hide();
  $('.voucherForm').hide();
  $('.usernameForm').hide();

  $('.loginButton').on('click', e => {
    $('.loginButton').hide();
    usernameInput.parent().parent().show();
  });
} else {
  $('.loginButton').hide();
  $('.usernameForm').hide();
  usernameInputError.hide();

  $('.title').text(`Welcome, ${currentUser}`);
  $('.subtitle').text(`Enter your voucher code below.`);
  $('.voucherForm').parent().show();
}

$('.logout').on('click', e => {
  window.localStorage.clear();
  location.reload();
});

usernameInput.on('input', async e => {
  let username = usernameInput.val();
  if (!username || username.length > 20 || username.length < 3) return usernameInputError.show();

  let mojangUsername = await (await fetch(`https://api.ashcon.app/mojang/v2/user/${username}`, { redirect: 'follow', method: 'GET' })).json();

  if (!mojangUsername) return usernameInputError.show();

  console.log(mojangUsername);

  //   $('#usernameImage').attr('src', `https://minotar.net/helm/${mojangUsername.username}/600.png`);

  usernameInputError.hide();
});

usernameButton.on('click', async e => {
  let username = usernameInput.val();
  if (!username || username.length > 20 || username.length < 3) return usernameInputError.show();

  let mojangUsername = await (await fetch(`https://api.ashcon.app/mojang/v2/user/${username}`, { redirect: 'follow', method: 'GET' })).json();

  if (!mojangUsername) return usernameInputError.show();

  if (usernameInputError.is(':visible')) return console.log('bruh');

  localStorage.setItem('username', username);

  location.reload();
});
