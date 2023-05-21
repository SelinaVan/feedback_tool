"use strict";
// import { data } from './data.js';

// add Dom content even when HTML is ready
document.addEventListener('DOMContentLoaded', function () {
  // import library
  var head = document.getElementsByTagName("head")[0];
  let style = document.createElement("style");

  var scriptJquery = document.createElement("script");
  scriptJquery.type = "text/javascript";
  scriptJquery.src =
    "https://cdnjs.cloudflare.com/ajax/libs/jquery/3.6.1/jquery.min.js";

  var scriptCropper = document.createElement("script");
  scriptCropper.type = "text/javascript";
  scriptCropper.src =
    "https://cdnjs.cloudflare.com/ajax/libs/cropperjs/1.5.6/cropper.min.js";

  var scriptHtml2Canvas = document.createElement("script");
  scriptHtml2Canvas.type = "text/javascript";
  scriptHtml2Canvas.src =
    "https://cdnjs.cloudflare.com/ajax/libs/html2canvas/1.4.1/html2canvas.min.js";

  var linkCropper = document.createElement("link");
  linkCropper.rel = "stylesheet";
  linkCropper.href =
    "https://cdnjs.cloudflare.com/ajax/libs/cropperjs/1.5.6/cropper.min.css";

  let fontAwesomeJS = document.createElement('script');
  fontAwesomeJS.type = 'text/javascript';
  fontAwesomeJS.src = 'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/js/all.min.js';

  let fontAwesomeCS = document.createElement('link');
  fontAwesomeCS.rel = 'stylesheet';
  fontAwesomeCS.href = 'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css';

  // append to head
  head.appendChild(style);
  head.appendChild(linkCropper);
  head.appendChild(scriptCropper);
  head.appendChild(scriptHtml2Canvas);
  head.appendChild(scriptJquery);
  head.appendChild(fontAwesomeJS);
  head.appendChild(fontAwesomeCS);

  // global variables
  const feedbackToolBodyData = [];
  let feedbackToolScreeBase64Data = [];
  const feedback_form_link = 'X46qqhUzGXFx701T9HaR';
  const feedback_form_format_url = 'http://localhost:8080/feedback/forms/';
  const feedback_form_submit_url = "http://localhost:8080/feedback/submit";
  let feedbackFormData = getFormDataFromLocalStorage({ name: 'feedback_form_data' })
  let feedbackToolUploadFile = {};
  let feedbackFormSubmitObj = [];
  let imageId = 0;
  // const mockupData = data;
  const typesExclude = ['button', 'file', 'screenshot'];
  const backgroundColor = mockupData?.widget?.buttonBgColor
  let thanksObject = {}
  let formDataGenerate = {}
  let formNameSubmit = ''
  const bugArray = ['Báo cáo lỗi', 'Report a bug'];
  const featureArray = ['Yêu cầu chức năng', 'Feature request'];
  const generalArray = ['Phản hồi chung', 'General feedback'];
  const surveyArray = ['Khảo sát', 'Survey'];
  // define loading function
  const onFeedbackToolPageLoading = () => {
    // create estential element first
    generateContainerElement(mockupData);
    // check if local storage didn't have data then call api
    // if (feedbackFormData?.length) {
    //   generateFormbase(mockupData.formData[0].data);
    // } else {
    //   getFormData(feedback_form_link);
    // } 
    // convert upload file
      convertFileUploadToBase64();
      onButtonScreenshotClick()
      // call function submit form
      $("#feedback-Tool-Review-Btn").click(onButtonFeebackFormToggle)
      $('#feedback__form_modal_close-button').click(onButtonCloseModalClick)
      // $("#feedback-tool-screenShot").on('click', onButtonScreenshotClick)
      $("#btn-submit").on("click", function(e) {
        e.preventDefault()
        submitFormFeedback()
      })
  
    var scriptSrc = document.getElementById("myscript").src;
    // console.log(scriptSrc.split("?")[1].split("&"));
  };
  // call function on page loading
  scriptJquery.onload = onFeedbackToolPageLoading;

  // create container element
  function generateContainerElement(data) {
    const { widget, formData, thanksMessage } = data
    thanksObject = { ...thanksMessage }
    let feedbackToolReviewModal = $("<div/>").attr("id", "feedback-Tool-Review-Modal")

    // button feedback, append here
    let feedbackToolReviewButtonContainer = $(`<div/>`).attr("id", "feedback-Tool-Review-Btn-container")

    let uploadedImage = $("<div/>").attr("id", "feedback-tool-uploaded-image");

    $("body").append(feedbackToolReviewButtonContainer);
    $("body").append(feedbackToolReviewModal);
    $("body").prepend(uploadedImage);

    // hide modal
    feedbackToolReviewModal.hide()
    //create button
    generateButtonFeedback(widget)
    // Get the button that opens the modal

    let modalContent = $("<div id='feedback-tool-modal-content'/>").addClass("feedback-tool-modal-content")

    let formContainer = $('<form id="feedback__form_content" action="#"/>')
    let formContent = $('<div id="feedback_form_content"/>')

    let welcomPage = $('<div id="feedback_welcome_page"/>')
    let thanksPage = $('<div id="feedback_thanks_page"/>')
    let closeButton = $('<span id="feedback__form_modal_close-button"><i class="fa-solid fa-xmark "></i></span>');

    // // title => render content from api
    let titleHeader = $("<h2 class='feedback_title'/>")

    // logo container 
    let logoContainer = $('<div/>').css({ 'display': 'flex', 'justify-content': 'center', 'align-items': 'center' })
    let logoImg = $('<img/>').attr('src', widget?.logo?.src).css({ 'width': '100px', 'object-fit': 'contain' })

    let buttonSubmitContainer = $('<div id="feedback_form_btn_submit_container"/>')
    let buttonFooter = $("<button id='btn-submit' class='feedback__form_btn-submit' type='submit'/>").text(`${widget?.buttonText}`).css({ 'background-color': widget?.buttonBgColor, 'color': widget?.textColor })

    // screen shot and upload container
    let screenshotContainer = $('<div id="feedback_screenshot_container"/>');
    let screenshotImgContainer = $('<div id="feedback_screenshot_img_container"/>');

    logoContainer.append(logoImg)
    buttonSubmitContainer.append(buttonFooter)
    formContainer.append(titleHeader, formContent, screenshotContainer, screenshotImgContainer, buttonSubmitContainer); //titleHeader,
    feedbackToolReviewModal.append(modalContent);
    modalContent.append(closeButton, logoContainer, formContainer, welcomPage, thanksPage );
    //welcomPage, thanksPage
    generateWelcomPage(formData)
    welcomPage.show()
    formContainer.hide()
    thanksPage.hide()
    // welcome page
    // if call here, screenshot work
    // generateFormbase(formData[0].data)
  
  }

  // generate 1st page
  function generateWelcomPage(data) {
    let welcomePage = $('#feedback_welcome_page');
    let formContainer = $('#feedback__form_content')
    welcomePage.html('')
    for (let i = 0; i < data.length; i++) {
      let container = `
      <div
        class='feedback_type_preview_wrapper'
        id='${data[i].formName}'
        data-name='${data[i].formName}'
      >
        <span style="font-size: 1.5rem;"><i class='fa-solid ${data[i].iconName}'></i></span>
        <h3>${data[i].formName}</h3>
      </div>
    `;
      welcomePage.append(container);
    }
    // Attach the click event using event delegation
    $('#feedback_welcome_page').on('click', '.feedback_type_preview_wrapper', function () {
      let name = $(this).data('name')
      formNameSubmit = name
      onButtonFormNameClick(name);
    });
  }
// when click formname will change to form page
   function onButtonFormNameClick(paramFormName) {
    let formContainer = $('#feedback__form_content')

    if (bugArray.includes(paramFormName)) {
      formDataGenerate = mockupData.formData.find(item => bugArray.includes(item.formName))
    }
    if (featureArray.includes(paramFormName)) {
      formDataGenerate = mockupData.formData.find(item => featureArray.includes(item.formName))
    }
    if (generalArray.includes(paramFormName)) {
      formDataGenerate = mockupData.formData.find(item => generalArray.includes(item.formName))
    }
    if (surveyArray.includes(paramFormName)) {
      formDataGenerate = mockupData.formData.find(item => surveyArray.includes(item.formName))
    }
     // title => render content from api
    $('.feedback_title').text(`${formDataGenerate?.title}`)
     generateFormbase(formDataGenerate?.data);
    $('#feedback_welcome_page').hide()
   
    formContainer.show()
  }
  // generate form base
  const generateFormbase = (data) => {
    console.log('data: ', data);
    let formContent = $('#feedback_form_content')
    let screenshotContainer = $('#feedback_screenshot_container');
    formContent.html('')
    screenshotContainer.html('')
   
    const files = data?.find((item) => item.type === 'file');
    const screenshots = data?.find((item) => item.type === 'screenshot');
    let otherInputType = data?.filter((item) => !typesExclude.includes(item.type)).sort((a, b) => {
      if (a.type === "rating") {
        return -1; // "rating" type should come first
      }
      if (b.type === "rating") {
        return 1; // "rating" type should come first
      }
      return 0; // for other types, maintain their order
    });


    for (var i = 0; i < otherInputType.length; i++) {
      const selectOptions = otherInputType[i].option
      var requiredText = otherInputType[i].required ? "*" : "";

      // type === rating
      if (otherInputType[i].type == "rating") {
        var ratingContainer = $(`<div class='form_preview_input_wrapper'>
                              <p style='text-transform: capitalize;word-break: break-word;'>${selectOptions.questionText} 
                              <span style='color: red'>${requiredText}</span>
                              <span id='feedback_error_${selectOptions.questionText.toLowerCase()}'></span>
                              </p></div>`);
        var ratingInner = $("<div class='feedback-form-rating'/>");
        ratingContainer.append(ratingInner);

        for (var z = 0; z < selectOptions.value; z++) {
          var radioId = `${selectOptions.questionText.toLowerCase()}_${z + 1}`;
          var radioInput = $("<input/>").attr({ name: selectOptions.questionText.toLowerCase(), type: "radio", value: z + 1, id: radioId }).hide()

          var starLabel = $("<label />").attr("for", radioId).html(`
            <span class='feedback_rating_icon fa-solid ${otherInputType[i].iconName}' style='color: ${backgroundColor}; font-size: 1.5rem; cursor:pointer'></span>`);

          starLabel.on("click", function () {
            var clickedValue = $(this).prev().val();
            $(this).children().css('color', 'gold');

            // Apply style to stars from 1 to clicked star
            $(this).siblings().each(function () {
              var value = $(this).prev().val();
              if (value <= clickedValue) {
                $(this).children().css('color', 'gold');
                $(this).children().siblings().find('.feedback_rating_icon').css('color', '');
              } else {
                $(this).children().css('color', backgroundColor)
              }
            });
          });
          ratingInner.append(radioInput, starLabel);

        }
        feedbackFormSubmitObj.push(selectOptions.questionText.toLowerCase());
        formContent.prepend(ratingContainer)
      }

      if (otherInputType[i].type == "text") {
        const textElement =
          $(`<div class='form_preview_input_wrapper'>
                      <label style='text-transform: capitalize;word-break: break-word;'>${selectOptions.labelText} <span style='color: red'>${requiredText}</span>
                      <span id='feedback_error_${selectOptions.questionText.toLowerCase()}'></span>
                      </label>
                      <input  name='${selectOptions.value}' id='${selectOptions.value}' placeholder='${selectOptions.questionText}'/> 
                    </div>
                  `)
        formContent.append(textElement)
        feedbackFormSubmitObj.push(selectOptions.value)
      }

      if (otherInputType[i].type == "textarea") {
        const textareaElement = $(`<div class='form_preview_input_wrapper'>
                          <label style='text-transform: capitalize;word-break: break-word;'>${selectOptions.labelText} <span style='color: red'>${requiredText}</span>
                          <span id='feedback_error_${selectOptions.questionText.toLowerCase()}'></span>
                          </label>
                          <textarea rows='3' name='${selectOptions.value}' id='${selectOptions.value}' placeholder='${selectOptions.questionText}'></textarea> 
                          </div>  
                          `)
        formContent.append(textareaElement)
        feedbackFormSubmitObj.push(selectOptions.value)
      }

      if (otherInputType[i].type == "select") {
        var selectContainer = $(`<div></div>`).addClass("form_preview_input_wrapper");
        selectContainer.append(
          $("<label style='text-transform: capitalize;word-break: break-word;'/>").html(`${selectOptions.questionText} <span style='color: red'>${requiredText} 
                            <span id='feedback_error_${selectOptions.questionText.toLowerCase()}'/></span>`),
          $("<select/>").attr({
            "name": selectOptions.value,
            "id": selectOptions.value
          }).append(
            $("<option/>").attr("disabled", true).attr("selected", true).val("0").text("=== Please Choose ===")
          ));
        for (var z = 0; z < selectOptions.answerOption.length; z++) {
          selectContainer.find("select").append(
            $("<option/>").attr({
              "id": selectOptions.answerOption[z].value,
              "value": selectOptions.answerOption[z].value,
            }).text(selectOptions.answerOption[z].text)
          );
        }
        formContent.append(selectContainer)
        feedbackFormSubmitObj.push(selectOptions.value);
      }

      if (otherInputType[i].type == "radio") {
        var divElement = $("<div />").attr("id", selectOptions.value);
        for (var z = 0; z < selectOptions.answerOption.length; z++) {
          divElement.append(
            `<div class='radio_checkbox_container'>
                            <input type='radio' name='${selectOptions.questionText}' value='${selectOptions.answerOption[z].value}' />
                            <label class='feedback__form_label' style='text-transform: capitalize;word-break: break-word;'> ${selectOptions.answerOption[z].text}</label>   
                          </div>
                        `);
        }
        feedbackFormSubmitObj.push(selectOptions.value)
        const label = $(`<div class='form_preview_input_wrapper'> 
                      <label style='text-transform: capitalize'>${selectOptions.questionText} <span style='color: red'>${requiredText}</span>
                      <span id='feedback_error_${selectOptions.questionText.toLowerCase()}'></span>
                      <label/></div>`)
        formContent.append(label, divElement,)
      }

      if (otherInputType[i].type == "checkbox") {
        var divElement = $("<div />").attr("id", selectOptions.value);
        for (var z = 0; z < selectOptions.answerOption.length; z++) {
          divElement.append(
            `<div class='radio_checkbox_container'>
                        <input  name='${selectOptions.questionText}' type='checkbox' value='${selectOptions.answerOption[z].value}' />
                        <label class='feedback__form_label' style='text-transform: capitalize; word-break: break-word;'>${selectOptions.answerOption[z].text}</label>   
                      </div>
                        `);
          feedbackFormSubmitObj.push(selectOptions.value)
        }
        const label = $(`<div class='form_preview_input_wrapper'>
                      <label style='text-transform: capitalize'>${selectOptions.questionText} <span style='color: red'>${requiredText}</span>
                      <span id='feedback_error_${selectOptions.questionText.toLowerCase()}'></span>
                      <label/></div>`)
        formContent.append(label, divElement,)

      }
    }
      if (!files && !screenshots) {
      screenshotContainer.html('')
    }
      if (screenshots !== undefined) {
      const screenshot = $(`<div class="feedback_screenshot_inner">
                          <button id='feedback-tool-screenShot' class='feedback__form-btn-capture'> <i class="fa-solid fa-camera" style='font-size: 1.5rem'></i> </button>
                          <div id=feedback-tool-crop-result /> </div>`)
      screenshotContainer.append(screenshot)
      feedbackFormSubmitObj.push(screenshots.option.value)

    }
    if (files !== undefined) {
      const fileElement = $(`<div class="feedback_screenshot_inner " id='feedback_upload_container'>
                          <span><i class="fa-solid fa-paperclip" style='font-size: 1.5rem'></i></span>
                          <input name='${files.option.labelText.toLowerCase()}' id='${files.option.labelText.toLowerCase()}' type='${files.type}' class='feedback_input_attachment'/>
                          <p id='feedback_input_file_name'/>
                          </div>`)
      screenshotContainer.append(fileElement)
      feedbackFormSubmitObj.push(files.option.labelText.toLowerCase())
    }


  };

  //  generate thank you page
  function generateThanksPage(thanksObject) {
    let thanksPage = $('#feedback_thanks_page')
    let formContainer = $('#feedback__form_content')
    let container = `
      <div class='form_thanks_preview'>
      <span style='color: ${thanksObject?.iconColorPicker}'>
       <i class='fa-solid ${thanksObject.iconName} thanks_message_icon'></i>
      </span>
      <h2 >${thanksObject?.messageTitle}</h2>
      <p>${thanksObject?.messageContent}</p>
    </div>
    `;
    formContainer.hide()
    thanksPage.append(container)
    thanksPage.show()
  }
  // submit functiton
  function submitFormFeedback() {
    const formSubmit = $('#feedback__form_content').serializeArray();
  
    // convert data from api to submit object
    const values = convertDataFormToUniqueArray(feedbackFormSubmitObj)
    let submitData = { 
      formName: formNameSubmit,
      ...values
    }
    // get data from form and assign to object
    readDataFromSubmitForm(submitData, formSubmit)
    const isValid = validateField(mockupData.formData[0].data, submitData)
    
    // validate Post data
    if (isValid) {
      console.log('submitData: ', submitData);
      generateThanksPage(thanksObject)
      $('#feedback__form_content')[0].reset()
      // callApiToSubmitFeedbackForm(submitData)
      setTimeout(() =>{
        $('#feedback-Tool-Review-Modal').hide()
        onButtonCloseModalClick()
      },3000)
    }
  }

  // CLOSE MODAL => WORK
  function onButtonCloseModalClick() {
    let thanksPage = $('#feedback_thanks_page')
    let welcomePage = $('#feedback_welcome_page');

    $('#feedback-Tool-Review-Modal').hide();
    $('#feedback__form_content').hide()
    thanksPage.hide();
    welcomePage.show();
    $('.feedback_title').text('')
    $('.form_thanks_preview').html('')
  }
  // TOGGLE MODAL FEEDBACK WHEN CLICK BUTTON => WORK
  function onButtonFeebackFormToggle() {
    $('#feedback-Tool-Review-Modal').toggle();
  }
  // function save form to local storage => work
  function saveFormDataToLocalStorage({ name, value }) {
    localStorage.setItem(`${name}`, JSON.stringify(value))
  }

  // function get data from local storage => work
  function getFormDataFromLocalStorage({ name }) {
    return JSON.parse(localStorage.getItem(`${name}`)) || null
  }
 
  //convert image to file base 64
  const convertFileUploadToBase64 = () => {
    $(document).on("input", "input:file", function (e) {
      const file = e.target.files[0];
      console.log('file: ', file);
      let feedbackFileName = $('#feedback_input_file_name')
      feedbackFileName.text('')
      if (file.name !== '') {
        feedbackFileName.text(`${file.name}`)
      }

      // Encode the file using the FileReader API
      const reader = new FileReader();
      reader.onloadend = () => {
        feedbackToolUploadFile = reader.result;
      };
      reader.readAsDataURL(file);
    });
  };
  function onButtonScreenshotClick() {
    $('#feedback-tool-screenShot').click(function (e) {
      e.preventDefault();
      console.log('click');
      $('#feedback-Tool-Review-Modal').hide();
      $('#feedback-Tool-Review-Btn').hide();
      screenShotPartOfScreen();
    });
   
  }
  // function screen a part of screen
  async function screenShotPartOfScreen() {
    try {
      let uploadedImage = $('#feedback-tool-uploaded-image');
      let screenshotContainer = $('#feedback_screenshot_container');
      screenshotContainer.find('#feedback-tool-img-crop-result').remove()
      $("#feedback-Tool-Review-Modal").hide() // hide modal at this position not throw error but canvas already draw modal

      // Calculate the height of the canvas to include the border
      const canvas = await html2canvas(document.body, {
        allowTaint: true,
        useCORS: true,
        scrollX: 0,
        scrollY: 0,
      });

      $('body').css('border', '2px solid red');

      $(uploadedImage).css('display', 'block')
      canvas.toBlob((blob) => {
        let file = new File([blob], "myImage.png", { type: "image/png" });
        getImageFromScreenShot(file, uploadedImage);
      }, "image/png");

      //create base64
      // $(uploadedImage).css('display', 'block');
      // let image = canvas.toDataURL("image/png");
      // let aElement = document.createElement("a");
      // aElement.setAttribute("download", "myImage.png");
      // aElement.setAttribute("href", image);
      // getImageFromScreenShot(image, uploadedImage);
    }
    catch (error) {
      console.log('error', error)
    }
  }
  // function get image from screenshot
  function getImageFromScreenShot(file, uploadedImageDiv) {
    const img = $('<img/>').attr('id', 'myGreatImage').attr('src', URL.createObjectURL(file)).css('width', '100%');

    uploadedImageDiv.append(img);
    processImageAfterCrop(uploadedImageDiv);
  }
  // function process image after scrop
  function processImageAfterCrop(uploadedImageDiv) {
    let myGreatImage = document.getElementById("myGreatImage");
    let cropper = null;

    cropper = new Cropper(myGreatImage, {
      viewMode: 4,
      movable: false,
      rotatable: false,
      zoomable: false,
      ready() {
        this.cropper.clear();
      },
      cropend(mouseup) {
        cropImage(uploadedImageDiv, cropper);
      },
    });
  }
  // function crop image
  function cropImage(uploadedImageDiv, cropper) {
    imageId++
    let screenshotContainer = $('#feedback_screenshot_container');
    let screenshotImgContainer = $('#feedback_screenshot_img_container');
    let imageWrapper = $('<div style="display: flex; justify-content: space-between; align-items: center;height: 40px"/>')
    let deleteButton = $('<span style="cursor: pointer"><i class="fa-solid fa-xmark"></i></span>')
    let pText = $('<p id="image-text" style="cursor: pointer"/>')
    imageWrapper.append(pText, deleteButton)
    let modal = $("#feedback-Tool-Review-Modal");
    let feedbackToolReviewBtn = $("#feedback-Tool-Review-Btn");

    // create base64
    // const imgurl = cropper.getCroppedCanvas().toDataURL();
    // console.log('imgurl: ', imgurl);
    // const img = $('<img id="feedback-tool-img-crop-result"/>').attr('src', imgurl).css({ 'width': '170px', 'height': '96px', 'border': 'solid', 'margin': '2px' });
    // screenshotContainer.append(img);
    cropper.getCroppedCanvas().toBlob((blob) => {
      let file = new File([blob], `myImage${imageId}.png`, { type: "image/png" });
      file.preview = URL.createObjectURL(blob);
      pText.text(file.name)
      deleteButton.attr('data-file-name', file.name);
      screenshotImgContainer.append(imageWrapper)

      $(uploadedImageDiv).hide();
      $(feedbackToolReviewBtn).show();
      $(modal).show();
      $('body').css('border', 'none');
      feedbackToolScreeBase64Data.push(file);
      // when click delete button will delete this image
      deleteButton.click(function () {
        const fileName = $(this).attr('data-file-name');
        URL.revokeObjectURL(file.preview);
        feedbackToolScreeBase64Data = feedbackToolScreeBase64Data.filter((item) => item.name !== fileName);
        imageWrapper.remove();
        $('.preview-image').remove();
      });
      // click name will open image
      pText.click(function () {
        const fileName = $(this).text();
        const previewImage = $('<img class="preview-image"/>').attr('src', file.preview);

        // Remove any previously appended preview images
        $('.preview-image').remove();

        $(modal).append(previewImage);
        previewImage.show();

        // Toggle the visibility of the preview image when clicked
        previewImage.click(function () {
          $(this).hide();
        });
      });
    })

  }
  // function get information from form
  function readDataFromSubmitForm(paramObj, formSubmit) {
    const checkboxValues = [];
    // get value of all input except
    $.each(formSubmit, function (_, field) {
      // assign value to object
      paramObj[field.name] = field.value;
    });

    paramObj.attachment = feedbackToolUploadFile;
    paramObj.screenshot = feedbackToolScreeBase64Data;
    // get value of checkbox dynamic, 
    $("input[type='checkbox']:checked").each(function () {
      const fieldName = $(this).attr('name');
      const value = $(this).val()

      if (!checkboxValues[fieldName]) {
        checkboxValues[fieldName] = []
      }
      checkboxValues[fieldName].push(value)
    })
    for (const fieldName in checkboxValues) {
      paramObj[fieldName] = checkboxValues[fieldName]
    }
  }

  // valid dynamic form
  function validateField(data, paramObj) {
    let emailRegex = /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/
    // filter require field
    let requiredField = data.filter(item => item.required === true).map(item => item.option.questionText.toLowerCase())
      for (let i = 0; i < requiredField.length; i++) { 
        const prop = requiredField[i]
        $(`#feedback_error_${prop}`).text('')
        if (paramObj.hasOwnProperty(prop) && paramObj[prop] === '') {
          $(`#feedback_error_${prop}`).text(`Please enter...`).css({ 'color': 'red', 'font-size': '12px' })
          $(`input[name="${prop}"]`).focus()
          $(`select[name="${prop}"]`).focus()
          $(`textarea[name="${prop}"]`).focus()
          return false;
        }
        if (prop === 'email' && !emailRegex.test(paramObj[prop])) {
          $(`#feedback_error_email`).text('Invalid email').css({ 'color': 'red', 'font-size': '12px' })
          return false;
        }
      }
    return true;
  }

  function convertDataFormToUniqueArray(paramForm) {
    // console.log('paramForm: ', paramForm);
    return (Array.from(new Set(paramForm))).reduce((obj, key) => {
      obj[key] = ''
      return obj
    }, {})
  }
  // CREATE FEEDBACK BUTTON BASE ON POSITION AND SHAPE => WORK
  function generateButtonFeedback(data) {
    let feedbackToolReviewBtnContainer = $('#feedback-Tool-Review-Btn-container')
    // define css of button base on position and shape
    const circleButton = ['Nút tròn', 'Circle button'];
    const positionOnPage = {
      'Giữa phải': { top: '50%', right: 0, transform: 'translate(30%, -50%) rotate(-90deg)' },
      'Giữa trái': { top: '50%', left: 0, transform: 'translate(-30%, -50%) rotate(90deg)' },
      'Dưới phải': { right: 0, bottom: 0 },
      'Dưới trái': { left: 0, bottom: 0 },
      'Middle Right': { top: '50%', right: 0, transform: 'translate(30%, -50%) rotate(-90deg)' },
      'Middle Left': { top: '50%', left: 0, transform: 'translate(-30%, -50%) rotate(90deg)' },
      'Bottom Right': { right: 0, bottom: 0 },
      'Bottom left': { left: 0, bottom: 0 },
    };

    const buttonShape = {
      'Nút tròn': { borderRadius: '50%', padding: '15px' },
      'Nút dài': { borerRadius: '3px', padding: '8px 15px' },
      'Circle button': { borderRadius: '50%', padding: '15px' },
      'Pill button': { borerRadius: '3px', padding: '8px 15px' },

    };
    const containerGeneralStyle = {
      display: 'block',
      width: 'auto',
      height: 'auto',
      position: 'fixed',
      zIndex: 999999999999999,
    };

    const buttonStyle = {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      gap: '5px',
      border: 'none',
      outline: 'none',
      textAlign: 'center',
      fontSize: '16px',
      color: data?.textColor,
      backgroundColor: data?.buttonBgColor,
      cursor: 'pointer',

    };
    const setButtonPosition = positionOnPage[data?.buttonPosition];
    const setButtonShape = buttonShape[data?.buttonStyle];
    let textShow = !circleButton.includes(data?.buttonStyle) ? data?.buttonText : ''

    feedbackToolReviewBtnContainer.css($.extend({}, containerGeneralStyle, setButtonPosition));

    let buttonInside = $('<button id="feedback-Tool-Review-Btn"/>').css($.extend({}, buttonStyle, setButtonShape));

    let iconInside = $(`<i class="fa-solid ${data?.iconName}"  style='font-size: 1.2rem'></i>`);
    let spanInside = $("<span style='font-size: 1rem'/>").html(`${textShow} `);

    feedbackToolReviewBtnContainer.append(buttonInside);
    buttonInside.append(spanInside);
    spanInside.append(iconInside);
  }
  // CALL API
  // function call api to submit form
  function callApiToSubmitFeedbackForm(submitData) {
    $.ajax({
      type: "POST",
      url: feedback_form_submit_url,
      data: JSON.stringify(submitData),
      contentType: "application/json; charset=utf-8",
      success: function () {
        console.log("success");
        $("#feedback-Tool-Review-Modal").hide()
      },
      error: (error) => {
        alert('The error happen, please try later')
        console.log(error);
      },
      dataType: "json",
    });
  }

  // call api to get form data
  const getFormData = (link) => {
    $.ajax({
      url: feedback_form_format_url + link,
      type: "GET",
      dataType: "json",
      async: false,
      success: function (res) {
        console.log('res: ', res);
        var questionData = res.data;
        // questionData.push(res.data);
        generateFormbase(questionData);
        generateContainerElement(mockupData);
        // set data to local storage to avoid call api every time to load page
        saveFormDataToLocalStorage({ name: 'feedback_form_data', value: questionData })
      },
      error: function (error) {

      }
    });
  };
  // function create screenshot whole screen
  // async function createScreenShot() {
  //   try {
  //     const stream = await navigator.mediaDevices.getDisplayMedia({ preferCurrentTab: true })

  //     let videoElement = document.createElement('video');
  //     const imageScreenShotDivWrapper = $('<div/>').attr('class', 'feedback-tool-img-screenshot-wrapper')
  //     let imageScreenshotElementPreview = $('<img/>').attr('class', 'feedback-tool-img-screenshot')
  //     imageScreenShotDivWrapper.append(imageScreenshotElementPreview)
  //     $('body').append(imageScreenShotDivWrapper)

  //     videoElement.addEventListener('loadedmetadata',() => {
  //       let canvasElement = document.createElement('canvas')
  //       const context = canvasElement.getContext('2d');
  //       // parsing video height and width
  //       canvasElement.width = videoElement.videoWidth;
  //       canvasElement.height = videoElement.videoHeight;

  //       videoElement.play() // avoid black screen when video loaded
  //       // drawing image
  //       context.drawImage(videoElement, 0, 0, canvasElement.width, canvasElement.height)
  //       stream.getVideoTracks()[0].stop() // terminate first video track of stream
  //       $(imageScreenshotElementPreview).attr('src', canvasElement.toDataURL());
  //       $(imageScreenshotElementPreview).removeClass('feedback-tool-img-screenshot')
  //       $(imageScreenshotElementPreview).addClass('screenshot-show')


  //     })
  //     videoElement.srcObject = stream // parsing capture stream to video source object
  //   }
  //   catch (error) {
  //     console.log('error', error)
  //   }
  // }

  // $("#feedback-tool-screenShot").click(createScreenShot)
  // create style css
  style.type = "text/css";
  let keyframes = `\
  @-webkit-keyframes animatetop {\
  from {\
    top: -300px;\
    opacity: 0;\
  }\
  to {\
    top: 0;\
    opacity: 1;\
  }\
}\
@keyframes animatetop {\
  from {\
    top: -300px;\
    opacity: 0;\
  }\
  to {\
    top: 0;\
    opacity: 1;\
  }\
}\

@keyframes rotate-center {
  0% {
    -webkit-transform: rotate(0);
    transform: rotate(0);
    opacity: 0;
  }

  100% {
    -webkit-transform: rotate(360deg);
    transform: rotate(360deg);
    opacity: 1;
  }
}

#feedback-Tool-Review-Modal::-webkit-scrollbar {
  width: 0;
  height: 0;
} 


.feedback-form-rating {
  display:flex;
} 

#feedback-Tool-Review-Modal {
  width: 100vw;
  height: 100%;
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  display: flex;
  align-items: center;
  justify-content: center;

}

.feedback-tool-modal-content {
  position: relative;
  min-width: 50%;
  max-width: 600px;
  max-height: 500px;
  min-height: 300px;
  background-color: #fefefe;
  margin: 0 auto;
  line-height: 25px;
  overflow: hidden;
  border-radius: 4px;
  box-shadow: 0 4px 30px rgba(0, 0, 0, 0.1);
  border: 1px solid rgba(255, 255, 255, 0.3);
  -webkit-animation-name: animatetop;
  -webkit-animation-duration: 0.4s;
  animation-name: animatetop;
  animation-duration: 0.4s;
  padding: 20px 0;
}

#feedback__form_content{
  padding: 0 30px;
  height: 450px;
  overflow-y: auto
}

#cropButton {
  display: none;
}
.feedback_title{
  text-align: center;
  word-wrap: break-word;
  overflow: hidden;
  padding: 0 20px;
  margin: 10px 0;
}
#feedback_form_btn_submit_container{
    margin: 10px auto;
    text-align: center;
}

.feedback__form_btn-submit{
  padding: 8px 20px;
  border: none;
  border-radius: 6px;
  outline: none;
  width: auto;
  cursor: pointer
}

.feedback__form_btn-submit:hover{
  background: black;
  color:white;
}
#feedback_screenshot_container{
  display: flex;
  justify-content: center;
  align-items: center;
  border: 1px dashed #C3C3C3;
  padding: 10px 0;
  margin: 10px 0;
}
.feedback_screenshot_inner{
  width: 50%;
  position: relative;
  display: flex;
  justify-content: center;
  align-items: center;
  flex-wrap: wrap;
}
.screenshot_border{
   border-right: 1px solid #C3C3C3;
}
.feedback__form-btn-capture{
  border: none;
  outline: none;
  cursor: pointer;
  background: transparent
}
.feedback_input_attachment{
    height: 100%;
    width: 100%;
    position: absolute; 
    top: 0;
    left: 0;
    bottom: 0;
    right: 0;
    opacity: 0;
    cursor: pointer;

}
#feedback__form_modal_close-button{
  cursor: pointer;
  position: absolute;
  right: 10px;
  top: 10px;
  color: black;
  font-size: 2rem;
}

.form_preview_input_wrapper{
  display: block;
}

.form_preview_input_wrapper > input:not([type='radio']):not([type='checkbox']):not([type='file']),
.form_preview_input_wrapper > textarea, .form_preview_input_wrapper > select
{
    width: 100%;
    min-height: 30px;
    outline: none;
    border: 0.5px solid #C3C3C3;
    margin: 5px 0px;
    background: #fafbfd;
    border-radius: 4px;
    text-indent: 10px;
}
.preview-image{
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 200px;
  border: 1px solid black;
  zIndex: 99999999999999;
  cursor: pointer
}
#feedback_welcome_page{
  margin: 20px 0;
}
.feedback_type_preview_wrapper{
  display: flex;
  align-items: center;
  gap: 20px;
  padding: 20px 50px;
  cursor: pointer;
}
.feedback_type_preview_wrapper:hover {
  background-color: #fafbfd;
  transition: 2s linear;
  border-bottom: 2px solid #6142EC;
}
.form_thanks_preview {
  margin: 40px auto;
  width: 80%;
  text-align: center;
}  
.form_thanks_preview > h2, .form_thanks_preview > p {
    width: 100%;
    line-break: strict;
    word-wrap: break-word;
    overflow: hidden;
}
.thanks_message_icon{
   animation: rotate-center 1s ease-in-out;
   font-size:2rem;

}
`;
  style.innerHTML = keyframes;
})

//   .feedback__form_modal - body input: not([type = 'radio']): not([type = 'checkbox']),
// .feedback__form_modal - body textarea,
// .feedback__form_modal - body select
// {
//   padding: 8px;
//   border: none;
//   outline: none;
//   background - color: #F3F4F6;
//   border - radius: 4px;
// }
// .feedback__form_label{
//   margin - left: 8px;
//   text - transform: capitalize;
// }


//   .feedback__form_modal - header {
//   padding: 5px 16px;
//   color: white;
//   position: -webkit - sticky;
//   background: linear - gradient(141deg, rgba(2, 0, 36, 1) 0 %, rgba(9, 9, 121, 1) 0 %, rgba(124, 94, 246, 1) 100 %);
//   position: sticky;
//   top: 0;
//   z - index: 1;
//   height: 50px;
//   display: flex;
//   justify - content: space - between;
//   align - items: center;

// }

// .feedback-form-rating:not(:checked) > input {
//   position:absolute;
//   top:-9999px;
//   clip:rect(0,0,0,0);
// }

//   .feedback - form - rating: not(: checked) > label {
//   display: inline - block;
//   width: 1em;
//   padding: 0 5px;
//   overflow: hidden;
//   white - space: nowrap;
//   cursor: pointer;
//   font - size: 200 %;
//   line - height: 1.2;
//   color: #ddd;
//   text - shadow: 1px 1px #bbb, 2px 2px #666, .1em .1em .2em rgba(0, 0, 0, .5);
// }


// .feedback - form - rating > input:checked ~label {
//   color: #f70;
//   text - shadow: 1px 1px #c60, 2px 2px #940, .1em .1em .2em rgba(0, 0, 0, .5);
// }

// .feedback - form - rating: not(: checked) > label: hover,
// .feedback - form - rating: not(: checked) > label:hover ~label {
//   color: gold;
//   text - shadow: 1px 1px goldenrod, 2px 2px #B57340, .1em .1em .2em rgba(0, 0, 0, .5);
// }

// .feedback - form - rating > input: checked + label: hover,
// .feedback - form - rating > input: checked + label:hover ~label,
// .feedback - form - rating > input:checked ~label: hover,
// .feedback - form - rating > input:checked ~label:hover ~label,
// .feedback - form - rating > label:hover ~input:checked ~label {
//   color: #ea0;
//   text - shadow: 1px 1px goldenrod, 2px 2px #B57340, .1em .1em .2em rgba(0, 0, 0, .5);
// }

// .feedback - form - rating > label:active {
//   position: relative;
//   top: 2px;
//   left: 2px;
// }
// #forth_and_back_btn_container{
//   display: flex;
//   justify - content: space - between;
//   padding: 5px 0;
//   width: 100 %
// }
// #forth_and_back_btn_container button {
//   border - radius: 50 %;
//   background: black;
//   color: white;
//   cursor: pointer;
//   padding: 6px;
//   outline: none;
//   border: none;
// }
// this work, to create button next and back
 // let forthAndBackBtnContainer = $('#forth_and_back_btn_container')
    // startValue = initialLoop * limitValue;
    // endValue = startValue + limitValue
    // // slide array to take limit value
    // let otherInputArray = otherInputType.slice(startValue, endValue);

    // forthAndBackBtnContainer.html('');

    // const buttonNextPrev = $(`<button id='feedback_btn_back'><i class="fa-solid fa-arrow-left"></i></i></button>
    //   <button id='feedback_btn_next'><i class="fa-solid fa-arrow-right"></i></button>`)
    
      // just render button back and next if array length > limit value
    // if (otherInputType.length > limitValue) {
    //   forthAndBackBtnContainer.append(buttonNextPrev)
    //   $('#feedback_btn_back').on('click', (e) => {
    //     e.preventDefault()
    //     onBtnGoToPrevQuestionClick(data)
    //   });
    //   $('#feedback_btn_next').on('click', (e) => {
    //     e.preventDefault()
    //     onBtnGoToNextQuestion(data)
    //   });
    // }
    // every time click, need to set inner of screenshot container to empty
    // screenshotContainer.html('')


      // function next question => work
  // function onBtnGoToNextQuestion(questionData) {
  //   $('#feedback_form_content').html('');
  //   if (initialLoop < Math.floor(questionData.length / limitValue) - 1) {
  //     ++initialLoop; // Increment the initialLoop variable
    
  //   } else {
  //     initialLoop = (Math.floor(questionData.length / limitValue) - 1);
  //   }

  //   generateFormbase(questionData);
  // }
  // // function prev question => work
  // function onBtnGoToPrevQuestionClick(questionData) {
  //   $('#feedback_form_content').html('');

  //   if (initialLoop > 0) {
  //     initialLoop--; // Decrement the initialLoop variable
  //   } else {
  //     initialLoop = 0;
  //   }
  //   generateFormbase(questionData);
  // }

const mockupData = {
  "widget": {
    "buttonBgColor": "orange",
    "buttonPosition": "Middle Left",
    "buttonStyle": "Pill button",
    "buttonText": "Feedback",
    "iconName": "fa-circle-question",
    "iconStyleIndex": 1,
    "isAttachLogo": false,
    "logo": {
      src: './allxone.jpg'
    },
    "textColor": "#FFFFFF"
  },
  "thanksMessage": {
    "icon": "Choose an icon",
    "iconColor": "Icon colour",
    "iconColorPicker": "orange",
    "iconIndexStyle": 1,
    "iconName": "fa-face-smile",
    "message": "Message",
    "messageContent": "We really appreciate your feedback.",
    "messageTitle": "Thank you",
    "name": "Thank You Message"
  },
  "formData": [
    {
      "formName": "Report a bug",
      "title": "Tell us what's broken",
      "iconName": "fa-bug",
      "data": [
        {
          "active": true,
          "id": 1,
          "name": "Name",
          "option": { "id": 1, "value": "name", "labelText": "Name", "questionText": "Name" },
          "required": true,
          "type": "text"
        },
        {
          "active": true,
          "id": 2,
          "name": "Email",
          "option": { "id": 1, "value": "email", "labelText": "Email", "questionText": "Email" },
          "required": true,
          "type": "text"
        },
        // {
        //   "active": true,
        //   "id": 3,
        //   "name": "Title",
        //   "option": { "id": 1, "value": "title", "labelText": "Title", "questionText": "Title" },
        //   "required": true,
        //   "type": "text"
        // },
        {
          "active": true,
          "id": 4,
          "name": "Comment",
          "option": {
            "id": 1,
            "value": "comment",
            "labelText": "Comment",
            "questionText": "Comment"
          },
          "required": true,
          "type": "textarea"
        },
        // {
        //   "active": true,
        //   "id": 5,
        //   "name": "Priority",
        //   "option": {
        //     "id": 1,
        //     "value": "priority",
        //     "labelText": "Priority",
        //     "questionText": "Priority",
        //     "answerOption": [
        //       { "id": 1, "value": "low", "text": "Low" },
        //       { "id": 2, "value": "medium", "text": "Medium" },
        //       { "id": 3, "value": "priority", "text": "Priority" }
        //     ]
        //   },
        //   "children": ["Low", "Medium", "Priority"],
        //   "required": true,
        //   "type": "select"
        // },
        {
          "active": true,
          "id": 6,
          "name": "Attachment",
          "option": {
            "id": 1,
            "value": "",
            "labelText": "Attachment",
            "questionText": "Attachment"
          },
          "required": true,
          "type": "file"
        },
        {
          "active": true,
          "id": 7,
          "name": "Rating",
          "option": {
            "id": 1,
            "value": 5,
            "labelText": "Rating",
            "questionText": "Rating"
          },
          "required": true,
          "type": "rating",
          iconName: "fa-star"
        },
        {
          "active": true,
          "id": 8,
          "name": "Button text",
          "option": {
            "id": 1,
            "value": "button text",
            "labelText": "Button text",
            "questionText": "Submit"
          },
          "required": false,
          "type": "button"
        },
        {
          "active": true,
          "id": 9,
          "name": "Screenshot",
          "option": {
            "id": 1,
            "value": "screenshot",
            "labelText": "Screenshot",
            "questionText": "Screenshot"
          },
          "required": false,
          "type": "screenshot"
        },
        // {
        //   "id":10,
        //   "option": {
        //     id: 1, value: 'question 1', labelText: 'question 1', questionText: 'question 1', answerOption:  [
        //       { "id": 1, "value": "option 1", "text": "option 1 " },
        //       { "id": 2, "value": "option 2", "text": "option 2 " }
        //     ]
        // },
        //   "required":false,
        //   "type":"radio"
        // },
        // {
        //   "id": 10,
        //   "option": {
        //     id: 1, value: 'question 1', labelText: 'question 1', questionText: 'question 2', answerOption: [
        //       { "id": 1, "value": "option 1", "text": "option 1 " },
        //       { "id": 2, "value": "option 2", "text": "option 2 " }
        //     ]
        //   },
        //   "required": false,
        //   "type": "checkbox"
        // }
      ]
    },
    {
      "formName": "General feedback",
      "title": "Tell us what we can improve",
      "iconName": "fa-file",
      "data": [
        {
          "active": true,
          "id": 1,
          "name": "Name",
          "option": { "id": 1, "value": "name", "labelText": "Name", "questionText": "Name" },
          "required": true,
          "type": "text"
        },
        {
          "active": true,
          "id": 2,
          "name": "Email",
          "option": { "id": 1, "value": "email", "labelText": "Email", "questionText": "Email" },
          "required": true,
          "type": "text"
        },
        {
          "active": true,
          "id": 3,
          "name": "Title",
          "option": { "id": 1, "value": "title", "labelText": "Title", "questionText": "Title" },
          "required": true,
          "type": "text"
        },
        {
          "active": true,
          "id": 4,
          "name": "Comment",
          "option": {
            "id": 1,
            "value": "comment",
            "labelText": "Comment",
            "questionText": "Comment"
          },
          "required": true,
          "type": "textarea"
        },
        {
          "active": true,
          "id": 5,
          "name": "Priority",
          "option": {
            "id": 1,
            "value": "priority",
            "labelText": "Priority",
            "questionText": "Priority",
            "answerOption": [
              { "id": 1, "value": "low", "text": "Low" },
              { "id": 2, "value": "medium", "text": "Medium" },
              { "id": 3, "value": "priority", "text": "Priority" }
            ]
          },
          "children": ["Low", "Medium", "Priority"],
          "required": true,
          "type": "select"
        },
        {
          "active": true,
          "id": 6,
          "name": "Attachment",
          "option": {
            "id": 1,
            "value": "",
            "labelText": "Attachment",
            "questionText": "Attachment"
          },
          "required": true,
          "type": "file"
        },
        {
          "active": true,
          "id": 7,
          "name": "Rating",
          "option": {
            "id": 1,
            "value": 5,
            "labelText": "Rating",
            "questionText": "Rating"
          },
          "required": true,
          "type": "rating",
          iconName: "fa-star"
        },
        {
          "active": true,
          "id": 8,
          "name": "Button text",
          "option": {
            "id": 1,
            "value": "button text",
            "labelText": "Button text",
            "questionText": "Submit"
          },
          "required": false,
          "type": "button"
        },
        {
          "active": true,
          "id": 9,
          "name": "Screenshot",
          "option": {
            "id": 1,
            "value": "screenshot",
            "labelText": "Screenshot",
            "questionText": "Screenshot"
          },
          "required": false,
          "type": "screenshot"
        },
        {
          "id": 10,
          "option": {
            id: 1, value: 'question 1', labelText: 'question 1', questionText: 'question 1', answerOption: [
              { "id": 1, "value": "option 1", "text": "option 1 " },
              { "id": 2, "value": "option 2", "text": "option 2 " }
            ]
          },
          "required": false,
          "type": "radio"
        },
        {
          "id": 10,
          "option": {
            id: 1, value: 'question 1', labelText: 'question 1', questionText: 'question 2', answerOption: [
              { "id": 1, "value": "option 1", "text": "option 1 " },
              { "id": 2, "value": "option 2", "text": "option 2 " }
            ]
          },
          "required": false,
          "type": "checkbox"
        }
      ]
    }
  ]
}
