import React, { useState ,useEffect,useCallback} from 'react'

import MarkdownIt from 'markdown-it';
import MdEditor from 'react-markdown-editor-lite';
// import style manually
import 'react-markdown-editor-lite/lib/index.css';
import Header from '../../Header/AdminHeader';

import { toast,ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import './DoctorManageRedux.css';
import Select from 'react-select';
import { useSelector,useDispatch } from 'react-redux';
import { useFetch ,handleLoginAPI,editMarkdown} from '../../../CustomHooks/useFetch'
import LoadingPage from '../../../CustomHooks/LoadingPage/LoadingPage';
import {getDetailInforDoctor} from '../../../CustomHooks/useFetch';

// Initialize a markdown parser
const mdParser = new MarkdownIt(/* Markdown-it options */);
   
const options = [
    { value: 'chocolate', label: 'Chocolate' },
    { value: 'strawberry', label: 'Strawberry' },
    { value: 'vanilla', label: 'Vanilla' },
];
const url_MarkDown = 'https://api-truongcongtoan.herokuapp.com/api/markdowns/';

const DoctorManageRedux = () => {

    //save to markdown table
    const [contentMarkDown, setContentMarkDown] = useState('');
    const [contentHTML, setContentHTML] = useState('');
    const [selectedDoctor, setselectedDoctor] = useState({});
    const [description, setdescription] = useState('');
    const [HaveOldData, setHaveOldData] = useState(false);
    let listDoctors = [];
   
    //save to doctor info table
    const [selectedPrice, setselectedPrice] = useState('')
    const [selectedPayment, setselectedPayment] = useState('')
    const [selectedProvince, setselectedProvince] = useState('')
    const [nameClinic, setnameClinic] = useState('')
    const [addressClinic, setaddressClinic] = useState('')
    const [note, setnote] = useState('')

    //-----------------------------
    let listPrice = []
    let listPayment = []
    let listProvince = []
   
    const [loading,setloading] = useState(false);
    const [errorFlg,setErrorFlg] = useState(false);
    const [detailDoctor, setdetailDoctor] = useState({});
   
    const [user, setUser] = useState({});

    let listfullDoctors = [];
 
    const [state, setstate] = useState({
        contentMarkDown:'',
        contentHTML:'',
        description:'',
        markdown_id:'',
        specialtyID:'',
        clinicID:'',
        users:''
        
    });

    //fetch data doctor 
    // const { data:doctors } = useFetch(url_doctor);
    const redux_user_Doctors=useSelector(state=>state.doctor);
    const redux_AllCode = useSelector(state => state.allCode);
    // const redux_user_Admin=useSelector(state=>state.admin);

    const [isOK, setIOK] = useState(false)

    //handle save content markdown
    const handleSaveContentMarkdown = () =>{
        if (HaveOldData === false) {
            try {
                createNewPost(state);
            } catch (error) {
                toast.error("Kh??ng th??? th??m m???i th??ng tin vui l??ng ki???m tra l???i !")
            }
        }else if(HaveOldData === true){           
            try {
                editMarkdown(url_MarkDown,state);
                toast.success("C???p nh???t th??ng tin th??nh c??ng !")
            } catch (error) {
                toast.error("Kh??ng th??? s???a th??ng tin vui l??ng ki???m tra l???i !")
            }
        }  
    }

    const createNewPost = async (data) =>{                                                                                                                                                         
        try {
           handleLoginAPI(url_MarkDown,data);
          toast.success("Th??m th??ng tin th??nh c??ng !")
          setHaveOldData(true);

        } catch (error) {
            console.log(error)
        }
    }
//handle change selected doctor
    const handleSelect = async (doctor) =>{
    try{   
        setselectedDoctor(doctor);

        let response = await getDetailInforDoctor(doctor.value);

          if (response!=null) {
            setdetailDoctor(response.data);
            }
        if (response && response.status===200 && response.data) {
           let doctorInfo = response.data;
            if(!doctorInfo.description && !doctorInfo.contentMarkDown){
                setdescription('');
                setContentMarkDown('');
                setHaveOldData(false);
            }else
            if (doctorInfo.description && !doctorInfo.contentMarkDown) {
                setdescription(doctorInfo.description);
                setContentMarkDown('');
                setHaveOldData(true);
            }else{
                setdescription(doctorInfo.description);
                setContentHTML(doctorInfo.contentHTML);
                setContentMarkDown(doctorInfo.contentMarkDown);
                setHaveOldData(true)
            }
            setIOK(true);
            
        }
        else{
            setdescription('');
            setContentHTML('');
            setContentMarkDown('');
            setHaveOldData(false);
        }

    }catch(error){
        console.log(error)
        setdescription('');
        setContentHTML('');
        setContentMarkDown('');
        setHaveOldData(false);

        }
}
const handleSelectInput = (input,flagIn) =>{
    
        if (flagIn === "price") {
            setselectedPrice(input);
        }
        if (flagIn === "payment") {
            setselectedPayment(input);
        }
        if (flagIn === "province") {
            setselectedProvince(input);
        }
    }
    //handle on change desciption
    const handleOnchangeDescription = (event) =>{
        setdescription(event.target.value);
    }
    //write nameclinic info
    const handleOnchangeIn = (event,flag) =>{
       if (flag ==="clinicName") {
        setnameClinic(event.target.value);
       }
       if (flag ==="addressClinic") {
        setaddressClinic(event.target.value);
       }
       if (flag ==="note") {
        setnote(event.target.value);
       }
    }

    // Finish!
const handleEditorChange = ({ html, text }) =>{
    setContentMarkDown(text);
    setContentHTML(html);
  }

  useEffect(() => {
  if ( redux_user_Doctors.listDoctors&&redux_user_Doctors.listDoctors.length>0) {
    for (let i = 0; i < redux_user_Doctors.listDoctors.length; i++) {
        listDoctors.push(buildDataInput(redux_user_Doctors.listDoctors[i],"doctor"));   
        listfullDoctors.push(redux_user_Doctors.listDoctors[i])
    }
  }
  let obj = listfullDoctors.find(o => o.hovaten === selectedDoctor.label);
  setUser(obj);
//   console.log("list doc tor ",listDoctors);
  },[selectedDoctor,listDoctors]);
 
//   console.log("gia tri price nhan duoc la ",redux_AllCode);
 useEffect(() => {
  if ( redux_AllCode.price&&redux_AllCode.price.length>0) {
    for (let i = 0; i < redux_AllCode.price.length; i++) {
        listPrice.push(buildDataInput(redux_AllCode.price[i],"price"));   
    }
    for (let i = 0; i < redux_AllCode.payment.length; i++) {
        listPayment.push(buildDataInput(redux_AllCode.payment[i],"payment"));   
    }
    for (let i = 0; i < redux_AllCode.province.length; i++) {
        listProvince.push(buildDataInput(redux_AllCode.province[i],"province"));   
    }
  }
  },[selectedPrice,listPrice,listPayment,selectedPayment,selectedProvince,listProvince]);


//   console.log("gia tri price nhan duoc la ",listPrice);
  useEffect(() => {
    
    setstate({
        contentMarkDown:contentMarkDown,
        contentHTML:contentHTML,
        description:description,
        users:user,
        markdown_id:selectedDoctor.value
    });
  }, [contentMarkDown,description]);

  const buildDataInput = (inputData,flag) =>{
    let object  = {};

   if (flag === "doctor") {
    if ( inputData ) {
      
        object.value = inputData.user_id;
        object.label = `${inputData.hovaten}`;
        }
   }
   if (flag === "price") {
    if ( inputData ) {
        object.value = inputData.key;
        object.label = `${inputData.valuevi}`;
      
        }
   }
   if (flag === "payment") {
    if ( inputData ) {
        object.value = inputData.key;
        object.label = `${inputData.valuevi}`;
      
        }
   }
   if (flag === "province") {
    if ( inputData ) {
        object.value = inputData.key;
        object.label = `${inputData.valuevi}`;
      
        }
   }

    return object;
  }


    return (
       <React.Fragment>
          {
            //    loading ?
            <React.Fragment>
            <Header/>
            <div className='manage-doctor-container'>
            
                   <div className='manage-doctor-title'>
                      T???o th??ng tin cho b??c s???
                   </div> 
                  
                   <div className='manage-doctor-editor'>
                   <div className='doctor-info'>
                   <div className='content-left form-group'>
                        <label>Ch???n b??c s???</label>
                        <Select
                           defaultValue={selectedDoctor}
                           onChange={handleSelect}
                           options={listDoctors}
                           placeholder = {"Ch???n b??c s??"}
                       />
                         
                    </div>
                    <div className='content-right form-group'>
                        <label>Th??ng tin gi???i thi???u: </label>
                         <textarea className='form-control' 
                         rows="4"
                         onChange={(event)=>handleOnchangeDescription(event)}
                         value={description}
                         >
                         </textarea>
                    </div>
                    </div>
                    
                    <div className="more-info-extra row">
                        <div className="col-4 form-group">
                            <label>Ch???n gi?? kh??m (????n v??? l?? ?????ng):</label>
                            <Select
                           defaultValue={selectedPrice}
                           onChange={ (event,flag) =>handleSelectInput(event,"price") }
                           options={listPrice}
                           placeholder = {"Ch???n gi?? kh??m"}
                       /> 
                        </div>
                        <div className="col-4 form-group">
                            <label>Ch???n ph????ng th???c thanh to??n:</label>
                            <Select
                           defaultValue={selectedPayment}
                           onChange={ (event,flag) =>handleSelectInput(event,"payment") }
                           options={listPayment}
                           placeholder = {"Ch???n ph????ng th???c thanh to??n"}
                          /> 
                        </div>
                        <div className="col-4 form-group">
                            <label>Ch???n t???nh th??nh:</label>
                            <Select
                           defaultValue={selectedProvince}
                           onChange={ (event,flag) =>handleSelectInput(event,"province") }
                           options={listProvince}
                           placeholder = {"Ch???n t???nh th??nh"}
                          /> 
                        </div>
                        <div className="col-4 form-group">
                            <label>T??n ph??ng kh??m: </label>
                            <input className="form-control"
                            onChange={(event,flag)=>handleOnchangeIn(event,"clinicName")}
                            value={nameClinic}
                            ></input>
                        </div>
                        <div className="col-4 form-group">
                            <label>?????a ch??? ph??ng kh??m:</label>
                            <input className="form-control"
                             onChange={(event,flag)=>handleOnchangeIn(event,"addressClinic")}
                             value={addressClinic}
                             ></input>
                        </div>
                        <div className="col-4 form-group">
                            <label>L??u ??:</label>
                            <input className="form-control"
                             onChange={(event,flag)=>handleOnchangeIn(event,"note")}
                             value={note}
                            ></input>
                        </div>
                    </div>

                       <MdEditor 
                       style={{ height: '500px',marginTop:'40px' }} 
                       renderHTML={text => mdParser.render(text)} 
                       onChange={handleEditorChange} 
                       value={contentMarkDown}
                       />

                   </div>
                   <button 
                   className={HaveOldData === true ?'save-content-doctor':'create-content-doctor'}
                   onClick={() => handleSaveContentMarkdown()}
                  
                   >
                     {
                         HaveOldData===true?
                           <span>L??u th??ng tin</span>
                           :  <span>T???o th??ng tin</span>
                     }
                   </button>
          
           </div>
           <ToastContainer
           position="top-right"
           autoClose={5000}
           hideProgressBar={false}
           newestOnTop={false}
           closeOnClick
           rtl={false}
           pauseOnFocusLoss
           draggable
           pauseOnHover
           theme='colored'
       />
       <ToastContainer
           position="top-right"
           autoClose={5000}
           hideProgressBar={false}
           newestOnTop={false}
           closeOnClick
           rtl={false}
           pauseOnFocusLoss
           draggable
           pauseOnHover
           theme='colored'
       />
       </React.Fragment>
    //    :<LoadingPage/>
          }
       </React.Fragment>
    )
}

export default DoctorManageRedux
