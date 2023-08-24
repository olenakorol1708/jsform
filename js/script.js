"use strict";
document.addEventListener('DOMContentLoaded', function () {
    const form = document.getElementById('form');
    form.addEventListener('submit', formSend);

    async function formSend(e) {
        e.preventDefault();

        let error = formValidate(form);
        let formData = new FormData(form);
        formData.append('image',formImage.files[0])

        if (error === 0) {
            form.classList.add('_sending');

           let response = await fetch("sendmail.php",{
            method:'POST',
            body:formData
           });
           if(response.ok){
            let result = await response.json();
            alert(result.message);
            formPreview.innerHTML = '';
            form.reset();
            form.classList.remove('_sending')

           }else{
            alert('Bug')
           }
        }else{
            alert("Write correct info")
        }
    }

    function formValidate(form) {
        let error = 0;
        let formReq = document.querySelectorAll('._req');

        for (let index = 0; index < formReq.length; index++) {
            const input = formReq[index];
            formRemoveError(input);

            if (input.classList.contains('_email')) {
                if (emailTest(input)) {
                    formAddError(input);
                    error++;
                }
            } else if (input.getAttribute("type") === "checkbox" && !input.checked) {
                formAddError(input);
                error++;
            } else {
                if (input.value === '') {
                    formAddError(input);
                    error++;
                }
            }
        }
        return error;
    }

    function formAddError(input) {
        input.parentElement.classList.add('_error');
        input.classList.add('_error');
    }
    
    function formRemoveError(input) {
        input.parentElement.classList.remove('_error');
        input.classList.remove('_error');
    }
    
    function emailTest(input) {
        return !/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,8})+$/.test(input.value);
    }

    const formImage = document.getElementById('formImage');//отримуємо input у змінну
    const formPreview = document.getElementById('formPreview');//отримуємо div для перегляду єлемента завчасно у змінну
    formImage.addEventListener('change',()=>{
        uploadFile(formImage.files[0])
    })

    function uploadFile() {
        var fileInput = document.getElementById('formImage'); // Assuming you have an element with the id 'formImage'
        var formPreview = document.getElementById('formPreview'); // Assuming you have an element with the id 'formPreview'
    
        var file = fileInput.files[0];
    
        if (!['image/jpeg', 'image/png', 'image/gif'].includes(file.type)) {
            alert("Only images are allowed");
            fileInput.value = '';
            return;
        }
        if (file.size > 2 * 1024 * 1024) {
            alert("Image size should be less than 2 MB");
            return;
        }
    
        var reader = new FileReader();
        reader.onload = function (e) {
            formPreview.innerHTML = `<img src="${e.target.result}" alt="Photo">`;
        };
        reader.onerror = function (e) {
            alert('Error');
        };
        reader.readAsDataURL(file);
    }



});