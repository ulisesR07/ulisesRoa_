

async function login(event){
    event.preventDefault();
    
    const email = document.getElementById('form-email').value;
    const password = document.getElementById('form-password').value;


    const response = await fetch('/api/auth/login', {
        method: 'POST',
        body: JSON.stringify({email, password}),
        headers: {   
            'Content-Type': 'application/json',      
        },
    });

    
    
    if (response.ok) {
        if (response.redirected) {
            window.location.replace(response.url);
            
        } else {
            const data = await response.json();
            console.log('data ', data)
            const token = data.token;
            
        }
    } else {
        const errorData = await response.json();
        console.log(errorData.error);
    }
}