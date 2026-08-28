document.addEventListener("DOMContentLoaded", () => {
    // 1. Initialize Cart Badge
    let count = parseInt(localStorage.getItem('tc_cart_count'));
    if (isNaN(count)) {
        count = 3; // Keep the default hardcoded 3 for aesthetic
        localStorage.setItem('tc_cart_count', 3);
    }
    
    const badge = document.getElementById('cartBadge');
    if (badge) {
        badge.textContent = count;
    }

    // 2. Attach Click Listeners to "Add to Cart" buttons
    const addBtns = document.querySelectorAll('.add-to-cart-btn');
    addBtns.forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.preventDefault();
            count++;
            localStorage.setItem('tc_cart_count', count);
            if (badge) {
                badge.textContent = count;
                // Add a little pop animation
                badge.style.transform = 'scale(1.5)';
                setTimeout(() => badge.style.transform = 'scale(1)', 200);
            }
            
            // Show SweetAlert Toast
            if (typeof Swal !== "undefined") {
                Swal.fire({
                    toast: true,
                    position: 'top-end',
                    icon: 'success',
                    title: 'បានបញ្ចូលទៅកន្ត្រកជោគជ័យ!',
                    showConfirmButton: false,
                    timer: 1500,
                    timerProgressBar: true
                });
            } else {
                alert("បានបញ្ចូលទៅកន្ត្រកជោគជ័យ!");
            }
        });
    });
});
