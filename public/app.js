const toCurrency = price => {
  return new Intl.NumberFormat('en-US', {
    currency: 'USD',
    style: 'currency'
  }).format(price)
}

const toDate = date => {
  return new Intl.DateTimeFormat('en-US', {
    year: 'numeric',
    month: 'long',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit'
  }).format(new Date(date));
};

document.querySelectorAll('.date').forEach(node => {
  node.textContent = toDate(node.textContent);
})

document.querySelectorAll('.price').forEach(node => {
  node.textContent = toCurrency(node.textContent);
});

const $cart = document.querySelector('#cart');

if ($cart) {
  $cart.addEventListener('click', e => {
    if (e.target.classList.contains('deleteButton')) {
      const id = e.target.dataset.id;

      fetch(`/cart/remove/${id}`, {
          method: 'delete'
        })
        .then(res => res.json())
        .then(cart => {
          if (cart.courses.length > 0) {
            const html = cart.courses.map(obj => {
              return `
                <tr>
                  <td>${obj.course.title}</td>
                  <td>${obj.quantity}</td>
                  <td>
                    <button class="btn btn-small deleteButton" data-id="${obj.course.id}">
                      Delete
                    </button>
                  </td>
                </tr>
              `
            }).join('');
            $cart.querySelector('tbody').innerHTML = html;
            $cart.querySelector('.price').innerHTML = toCurrency(cart.totalPrice);
          } else {
            $cart.innerHTML = '<p>Cart is empty.</p>';
          }
        });
    }
  });
}