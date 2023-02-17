const voucherInputError = $("label[for='voucher']");
const voucherButton = $('#voucherSubmit');
const voucherInput = $('#voucherInput');
const voucherDetails = $('.voucherDetails');

voucherDetails.hide();
voucherInputError.hide();

voucherInput.on('input', async e => {
  $('.submitIcon').text('close');
  let voucher = voucherInput.val().toUpperCase();
  if (!voucher || voucher.length > 32) return voucherInputError.show();

  voucherDetails.hide();

  let apiVoucher;
  try {
    let mojangUsername = await (await fetch(`https://api.ashcon.app/mojang/v2/user/${window.localStorage.getItem('username')}`, { redirect: 'follow', method: 'GET' })).json();

    apiVoucher = await (await fetch(`https://voucherpanel.sharpmc.org/api/${voucher}`)).json();
    if (apiVoucher.voucher.playerSpecific && apiVoucher.voucher.playerUUID !== mojangUsername.uuid) return voucherInputError.show();
    if (!apiVoucher.successful) return voucherInputError.show();
    if (!apiVoucher.voucher.active) {
      voucherInputError.text('Voucher Already Redeemed');
      voucherInputError.show();
      return;
    }
    $('.submitIcon').text('arrow_forward');
  } catch (err) {
    return voucherInputError.show();
  }

  let html = `<span class="voucherDetailsTitle">Package</span>
  <span class="voucherDetailsSubtitle"><span id="pathBack">${apiVoucher.voucher.product.category.split(/\_/gim).join(' ')} /</span> <span id="pathCurrent">${apiVoucher.voucher.product.name}</span></span>`;

  voucherDetails.html(html);
  voucherDetails.show();

  voucherInputError.hide();
});

voucherButton.on('click', async e => {
  let voucher = voucherInput;
  let icon = $('.submitIcon').text();

  if (!voucher.val() || voucher.val().length > 32) voucherInputError.show();

  switch (icon) {
    case 'close':
      location.reload();
      break;
    case 'arrow_back':
      voucher.val('');
      break;
    default:
      break;
  }

  if (icon === 'arrow_forward') {
    let apiVoucher;
    try {
      let mojangUsername = await (await fetch(`https://api.ashcon.app/mojang/v2/user/${window.localStorage.getItem('username')}`, { redirect: 'follow', method: 'GET' })).json();

      apiVoucher = await (await fetch(`https://voucherpanel.sharpmc.org/api/${voucher.val()}`)).json();
      if (apiVoucher.voucher.playerSpecific && apiVoucher.voucher.playerUUID !== mojangUsername.uuid) return voucherInputError.show();
      if (!apiVoucher.successful) return voucherInputError.show();

      $('.submitIcon').text('arrow_forward');
    } catch (err) {
      return voucherInputError.show();
    }

    let productData;
    try {
      productData = await (await fetch(apiVoucher.voucher.product.dataURL)).json();
    } catch (err) {
      return voucherInputError.show();
    }

    fetch(`https://voucherpanel.sharpmc.org/api/redeem/${voucher.val()}?player=${window.localStorage.getItem('username')}`, {
      method: 'PUT',
      redirect: 'follow',
    })
      .then(response => response.json())
      .then(result => {
        if (!result.successful) location.href = '/failed.html';

        location.href = '/success.html';
      });
  }

  // localStorage.setItem('voucher', voucher);
});
