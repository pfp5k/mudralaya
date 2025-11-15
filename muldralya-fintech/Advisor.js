
        // --- Form Validation Logic (Unchanged) ---
        document.getElementById('advisorForm').addEventListener('submit', function (event) {
            event.preventDefault(); 
            event.stopPropagation();

            const form = this;
            let isValid = true;
            
            form.querySelectorAll('.form-control, .form-select').forEach(input => {
                input.classList.remove('is-invalid', 'is-valid');
            });
            
            // 1. Full Name Validation
            const fullName = document.getElementById('fullName');
            if (fullName.value.trim() === '') {
                fullName.classList.add('is-invalid');
                isValid = false;
            } else {
                fullName.classList.add('is-valid');
            }

            // 2. Mobile Number Validation (10 digits)
            const mobileNumber = document.getElementById('mobileNumber');
            const mobileRegex = /^[0-9]{10}$/;
            if (!mobileRegex.test(mobileNumber.value)) {
                mobileNumber.classList.add('is-invalid');
                isValid = false;
            } else {
                mobileNumber.classList.add('is-valid');
            }

            // 3. Email ID Validation
            const emailId = document.getElementById('emailId');
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(emailId.value.trim())) {
                emailId.classList.add('is-invalid');
                isValid = false;
            } else {
                emailId.classList.add('is-valid');
            }

            // 4. Date of Birth Validation (DD.MM.YYYY format and a valid date)
            const dateOfBirth = document.getElementById('dateOfBirth');
            const dateRegex = /^(\d{2})\.(\d{2})\.(\d{4})$/;
            const match = dateOfBirth.value.match(dateRegex);

            if (!match) {
                dateOfBirth.classList.add('is-invalid');
                isValid = false;
            } else {
                const day = parseInt(match[1], 10);
                const month = parseInt(match[2], 10);
                const year = parseInt(match[3], 10);

                const date = new Date(year, month - 1, day); 
                const today = new Date();

                if (date.getFullYear() !== year || date.getMonth() !== month - 1 || date.getDate() !== day || date > today) {
                    dateOfBirth.classList.add('is-invalid');
                    isValid = false;
                } else {
                    dateOfBirth.classList.add('is-valid');
                }
            }

            // 5. Profession Validation
            const profession = document.getElementById('profession');
            if (profession.value === '' || profession.value === 'Select Profession') {
                profession.classList.add('is-invalid');
                isValid = false;
            } else {
                profession.classList.add('is-valid');
            }

            // 6. IRDAI License Validation
            const irdaLicense = document.getElementById('irdaLicense');
            if (irdaLicense.value === '' || irdaLicense.value === 'Select Option') {
                irdaLicense.classList.add('is-invalid');
                isValid = false;
            } else {
                irdaLicense.classList.add('is-valid');
            }

            // --- Submission Handling ---
            if (isValid) {
                const formData = new FormData(form);
                const data = {};
                for (const [key, value] of formData.entries()) {
                    data[key] = value;
                }
                
                console.log('Form data ready for submission:', data);
                form.reset();
                form.querySelectorAll('.form-control, .form-select').forEach(input => {
                    input.classList.remove('is-valid');
                });
                
                const successMsg = document.createElement('div');
                successMsg.className = 'alert alert-success mt-3';
                successMsg.textContent = 'Success! Your form has been submitted. We will contact you shortly.';
                form.parentNode.insertBefore(successMsg, form.nextSibling);

                setTimeout(() => {
                    successMsg.remove();
                }, 5000);

            } else {
                console.log('Form submission failed due to validation errors.');
            }
        });
    