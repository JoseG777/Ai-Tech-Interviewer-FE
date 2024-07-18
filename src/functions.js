let leaveAttempts = 0;

        function handleNavigation() {
            leaveAttempts++;
            if (leaveAttempts < 2) {
                const message = 'Leaving this page will result in your work being automatically submited! You will not be able to make changes to this submition';
                if (alert(message)){
                    console.log("user wants to leave the page")
                }else {
                    console.log("user choose to stay. They have one more chance")
                }
            } else {
                document.getElementById('userForm').querySelectorAll('input').forEach(input => input.disabled = true);
                console.log('Changes saved and editing disabled.');
            }
        }

        window.addEventListener('beforeunload', handleNavigation);
        document.addEventListener('visibilitychange', function () {
            if (document.visibilityState === 'hidden') {
                alert("You have navigated away from the page")
                handleNavigation();
            }
        });