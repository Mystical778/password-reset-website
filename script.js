// ============================================================================
// SUPABASE CONFIGURATION - REPLACE WITH YOUR CREDENTIALS
// ============================================================================
const SUPABASE_URL = 'https://reybokhaxnnqswjmxljv.supabase.co'; // e.g., https://xxxxx.supabase.co
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJleWJva2hheG5ucXN3am14bGp2Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjQyNTQ1NzYsImV4cCI6MjA3OTgzMDU3Nn0.i94MvCxm1IQLJIE9W3tC3OTYsn97mytjcC9yErl953Q'; // Your anonymous key
const REDIRECT_URL = window.location.origin; // Password reset redirect URL

// Initialize Supabase client
const { createClient } = window.supabase;
const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

// ============================================================================
// DOM ELEMENTS
// ============================================================================
const requestResetBox = document.getElementById('requestResetBox');
const newPasswordBox = document.getElementById('newPasswordBox');
const resetForm = document.getElementById('resetForm');
const emailInput = document.getElementById('email');
const emailError = document.getElementById('emailError');
const successMessage = document.getElementById('successMessage');
const errorMessage = document.getElementById('errorMessage');
const errorText = document.getElementById('errorText');
const submitBtn = document.getElementById('submitBtn');

const newPasswordForm = document.getElementById('newPasswordForm');
const passwordInput = document.getElementById('password');
const confirmPasswordInput = document.getElementById('confirmPassword');
const passwordError = document.getElementById('passwordError');
const confirmPasswordError = document.getElementById('confirmPasswordError');
const updateBtn = document.getElementById('updateBtn');
const updateSuccessMessage = document.getElementById('updateSuccessMessage');
const updateErrorMessage = document.getElementById('updateErrorMessage');
const updateErrorText = document.getElementById('updateErrorText');

// ============================================================================
// EMAIL VALIDATION & REQUEST PASSWORD RESET
// ============================================================================
const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

emailInput.addEventListener('blur', validateEmail);
emailInput.addEventListener('input', function() {
    if (emailInput.value && emailError.textContent) {
        validateEmail();
    }
});

function validateEmail() {
    const email = emailInput.value.trim();
    
    if (!email) {
        emailError.textContent = 'Email is required';
        return false;
    }
    
    if (!emailRegex.test(email)) {
        emailError.textContent = 'Please enter a valid email address';
        return false;
    }
    
    emailError.textContent = '';
    return true;
}

resetForm.addEventListener('submit', async function(e) {
    e.preventDefault();
    
    successMessage.style.display = 'none';
    errorMessage.style.display = 'none';
    errorText.textContent = '';
    
    if (!validateEmail()) {
        return;
    }

    const email = emailInput.value.trim();
    submitBtn.disabled = true;
    submitBtn.textContent = 'Sending...';

    try {
        // Send password reset email via Supabase
        const { error } = await supabase.auth.resetPasswordForEmail(email, {
            redirectTo: `${REDIRECT_URL}?type=recovery`
        });

        if (error) {
            throw error;
        }

        // Success - hide form and show success message
        successMessage.style.display = 'block';
        resetForm.style.display = 'none';
        
    } catch (error) {
        console.error('Error:', error.message);
        errorMessage.style.display = 'block';
        errorText.textContent = error.message || 'An error occurred. Please try again later.';
    } finally {
        submitBtn.disabled = false;
        submitBtn.textContent = 'Send Reset Link';
    }
});

// ============================================================================
// PASSWORD RESET FUNCTIONALITY
// ============================================================================
function validatePassword() {
    const password = passwordInput.value;
    
    if (!password) {
        passwordError.textContent = 'Password is required';
        return false;
    }
    
    if (password.length < 8) {
        passwordError.textContent = 'Password must be at least 8 characters';
        return false;
    }
    
    passwordError.textContent = '';
    return true;
}

function validateConfirmPassword() {
    const password = passwordInput.value;
    const confirmPassword = confirmPasswordInput.value;
    
    if (!confirmPassword) {
        confirmPasswordError.textContent = 'Please confirm your password';
        return false;
    }
    
    if (password !== confirmPassword) {
        confirmPasswordError.textContent = 'Passwords do not match';
        return false;
    }
    
    confirmPasswordError.textContent = '';
    return true;
}

passwordInput.addEventListener('blur', validatePassword);
passwordInput.addEventListener('input', function() {
    if (passwordInput.value && passwordError.textContent) {
        validatePassword();
    }
    // Also re-validate confirm password if it has a value
    if (confirmPasswordInput.value) {
        validateConfirmPassword();
    }
});

confirmPasswordInput.addEventListener('blur', validateConfirmPassword);
confirmPasswordInput.addEventListener('input', function() {
    if (confirmPasswordInput.value && confirmPasswordError.textContent) {
        validateConfirmPassword();
    }
});

newPasswordForm.addEventListener('submit', async function(e) {
    e.preventDefault();
    
    updateSuccessMessage.style.display = 'none';
    updateErrorMessage.style.display = 'none';
    updateErrorText.textContent = '';
    
    if (!validatePassword() || !validateConfirmPassword()) {
        return;
    }

    const newPassword = passwordInput.value;
    updateBtn.disabled = true;
    updateBtn.textContent = 'Updating...';

    try {
        // Update password in Supabase
        const { error } = await supabase.auth.updateUser({
            password: newPassword
        });

        if (error) {
            throw error;
        }

        // Success
        updateSuccessMessage.style.display = 'block';
        newPasswordForm.style.display = 'none';
        
        // Redirect after 2 seconds
        setTimeout(() => {
            window.location.href = '/';
        }, 2000);
        
    } catch (error) {
        console.error('Error:', error.message);
        updateErrorMessage.style.display = 'block';
        updateErrorText.textContent = error.message || 'An error occurred. Please try again later.';
    } finally {
        updateBtn.disabled = false;
        updateBtn.textContent = 'Update Password';
    }
});

// ============================================================================
// CHECK FOR PASSWORD RESET RECOVERY LINK (CORRECTED)
// ============================================================================
document.addEventListener('DOMContentLoaded', async function() {
    // Supabase puts the tokens in the URL hash, not the search parameters.
    // We need to parse the hash manually.
    const hash = window.location.hash.substring(1); // Remove the '#'
    const params = new URLSearchParams(hash);
    
    const accessToken = params.get('access_token');
    const refreshToken = params.get('refresh_token');
    const type = params.get('type');

    if (type === 'recovery' && accessToken && refreshToken) {
        try {
            // Create a session with the tokens from the reset link
            const { error } = await supabase.auth.setSession({
                access_token: accessToken,
                refresh_token: refreshToken
            });

            if (error) {
                throw error;
            }

            // Show the new password form and hide the old one
            requestResetBox.style.display = 'none';
            newPasswordBox.style.display = 'block';

            // Clear the URL to hide sensitive tokens
            window.history.replaceState({}, document.title, window.location.pathname);
            
        } catch (error) {
            console.error('Error validating reset link:', error.message);
            // Show an error on the original request form
            requestResetBox.style.display = 'block';
            newPasswordBox.style.display = 'none';
            errorMessage.style.display = 'block'; 
            errorText.textContent = 'Invalid or expired reset link. Please request a new one.';
        }
    }
});