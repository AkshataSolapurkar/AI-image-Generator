const form= document.querySelector('.form-generation');
const ImageGallery=document.querySelector('.dimond');
const OPENAI_API_KEY = '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';

const updateImgCard = (imgDataArray)=>{
   imgDataArray.forEach((imgObject, index) =>{
    const imgCard= ImageGallery.querySelectorAll(".imgcrd")[index];
    const imgElement = imgCard.querySelector('img')
    const downloadBtn= imgCard.querySelector('.downloadbtn');
    const AiGeneratedImage =`data:image/jpeg;base64,${imgObject.b64_json}`
    imgElement.src=AiGeneratedImage

    imgElement.onload=()=>{
      imgCard.classList.remove('loading')
      downloadBtn.setAttribute('herf',AiGeneratedImage);
      downloadBtn.setAttribute('download',`${new Date().getTime()}.jpg`)
    }
   })
}

const handelform = (e) =>{
 e.preventDefault();
 const userprompt = e.target[0].value
 const userImg =e.target[1].value
 console.log(userprompt);
 console.log(userImg);

 //create card on Selected Number
  const ImgMarkup = Array.from({length: userImg}, () =>
    `<div class="loading bg-[#fafafa] rounded-[5px] flex items-center justify-center imgcrd relative w-[285px] aspect-square ">
    <img class="overflow-hidden object-cover" src="Spinner-1s-200px.svg" alt="img">
    <a href="" class="downloadbtn">
        <img class="rounded-full h-[36px] w-[36px]" src="download.png" alt="download">
    </a>
</div>`
  ).join("");

  ImageGallery.innerHTML=ImgMarkup;
  generateAiImage(userprompt,userImg);
}

const generateAiImage =async (userprompt,userImg) =>{
   try{
     const response =await fetch("https://api.openai.com/v1/images/generations",{
        method: 'POST',
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${OPENAI_API_KEY}`

        },
        body: JSON.stringify({
            prompt:userprompt,
            n: parseInt(userImg),
            response_format:"b64_json",
            size: "512x512"

        })
     });
     if(!response.ok) throw new Error('Failed to Generate Image!! Please Try Again')
    const { data }=  await response.json();
  console.log(data)
    updateImgCard([...data])
   }catch(error){
    alert(error.message)
   }
}

form.addEventListener('submit', handelform);
