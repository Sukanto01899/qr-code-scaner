const uploadBtn = document.getElementById('upload-btn'),
[imgBox, fileNameBox, btnBox] = document.querySelectorAll('.content .element'),
contentStatus = document. querySelector('.active'),
scanBtn = document.querySelector('#scan-btn'),
clearBtn = document.querySelector('#clear-btn'),
reportBox = document.querySelector('#report-describetion'),
copyBtn = document.querySelector('#copy-btn');
let imgUrl,
isClick = true;

const upload = ()=>{
    const client = filestack.init('AlN0wiEY4TqGmgs9RiW6Iz');
     const getObj = {
    onUploadDone: file => {
        if(file.filesFailed.length === 0){
            getFile(file.filesUploaded[0])
        }else{
            console.log('file.fileFeiled Object come')
        }
    }
   }
   client.picker(getObj).open()
};

const getFile = (data)=>{
    const {filename, url} = data;
    imgUrl = url;
    document.querySelector('.content .img img').src = url;
    fileNameBox.innerText = filename.length > 15 ? filename.substring(0, 15) +'...'+ filename.split('.')[1] : filename;
    displayContent('block')
};

const displayContent = (status)=>{
    contentStatus.style.display = status
};

scanBtn.addEventListener('click', ()=>{
    if(!isClick){
        scanBtn.removeAttribute('data-bs-toggle')
        scanBtn.removeAttribute('data-bs-target')
        return isClick = true;
    }
    imgBox.classList.add('scan')
    fetch(`https://api.qrserver.com/v1/read-qr-code/?fileurl=${imgUrl}`)
    .then(res => res.json())
    .then(data => showReport(data))
    .catch(err => console.log(err))
})
clearBtn.addEventListener('click', ()=> displayContent('none'))

const showReport = (data)=>{
    console.log(data[0].symbol[0].data)
    imgBox.classList.remove('scan')
    scanBtn.setAttribute('data-bs-toggle', 'modal')
    scanBtn.setAttribute('data-bs-target', '#staticBackdrop')
    if(data[0].symbol[0].data === null){
        reportBox.innerHTML = `<P id="describetion">Please give a vaild QR code</p>`
    }
    else if(data[0].symbol[0].data.startsWith('http')){
        reportBox.innerHTML = `<a id="describetion" href="${data[0].symbol[0].data}">${data[0].symbol[0].data}</a>`
    }else{
        reportBox.innerHTML = `<P id="describetion">${data[0].symbol[0].data}</p>`;
    }
    if(isClick){
        isClick = false;
        scanBtn.click();
    }
};



const copyContent = async () => {
    const text = document.getElementById("describetion").innerHTML;
    try {
      await navigator.clipboard.writeText(text);
      copyBtn.innerText = 'Coped!'
      setTimeout(()=>{
        copyBtn.innerText = 'Copy'
      },1000)
    } catch (err) {
      console.error('Failed to copy: ', err);
    }
  }

  uploadBtn.addEventListener('click', upload)
copyBtn.addEventListener('click',copyContent)