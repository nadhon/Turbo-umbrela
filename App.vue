const { createApp } = Vue

createApp({
    goto(Home) {
        if (Home === 'login') {
            alert("Indo para Login")
        }
        else if (Home === 'register') {
            alert("Indo para Register")
        }
    }
})
