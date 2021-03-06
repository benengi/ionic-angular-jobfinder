import { Component, ElementRef, ViewChild } from '@angular/core';
import { NavController, LoadingController, NavParams, ActionSheetController } from 'ionic-angular';
import { Config } from '../../../provider/config';
import { UtilService } from '../../../provider/util-service';
import { Auth } from '../../../provider/auth';
import { EmployerService } from '../../../provider/employer-service';
import { EmployerEditjobLocationPage } from '../editjob-location/employer-editjob-location';
import { Camera, File, Transfer, FilePath  } from 'ionic-native';
import * as $ from 'jquery';

@Component({
  selector: 'page-employer-postjob-edit',
  templateUrl: 'employer-postjob-edit.html'
})
export class EmployerPostJobEditPage {

  arrIndustry = [];
  arrPosition = [];

  company_name = "";
  job_title = "";
  job_desc = "";
  job_req = "";
  job_industry = "#alljobs";
  job_time = "Full Time";
  job_location = "";

  file_image_back = null;
  file_image = null;

  bedit = false;
  data: any;

  backimage = null;
  image = null;
  opt = 0;

  @ViewChild('fileInp') fileInput: ElementRef;
  @ViewChild('fileInp1') fileInput1: ElementRef;

  constructor(public navCtrl: NavController, 
    public config: Config,
    public util: UtilService,
    public auth: Auth,
    public employerService: EmployerService,
    public loading: LoadingController,
    public actionSheetCtrl: ActionSheetController,
    public navParams: NavParams) {
        this.arrIndustry = ["#hospitality", "#entertainment", "#fastfood", "#construction", "#sales", "#retail", "#notforprofit", "#logistics", "#administration", "#agedcare", "#banking", "#callcentre", "#childcare", "#consumergoods", "#creative", "#defence", "#education", "#entrepreneur", "#financialservices", "#government", "#healthcare", "#hr", "#legal", "#manufacturing", "#marketing", "#media", "#mining", "#officesupport", "#professionalservices", "#property", "#recreation", "#recruitment", "#selfemployed", "#software", "#sports", "#technicalsupport", "#technology", "#telecommunications", "#tourism", "#trades", "#transport", "#cleaning", "#fashion", "#hairandbeauty", "#services"];
        this.arrPosition = ["Full Time", "Part Time", "Casual", "Contract", "Internship"];
        this.data = this.navParams.get('data');
        console.log(this.data);
  }

  presentActionSheet(opt) {
    this.opt = opt;
   const actionSheet = this.actionSheetCtrl.create({
     title: '',
     buttons: [
       {
         text: 'Camera',
         handler: () => {
           //this.clickCamera = true;
           this.takePicture(opt, Camera.PictureSourceType.CAMERA);
         }
       },
       {
         text: 'Library',
         handler: () => {
           //this.clickCamera = true;
           this.takePicture(opt, Camera.PictureSourceType.PHOTOLIBRARY);
           //this.upload_image();
         }
       },
       {
         text: 'Cancel',
         role: 'cancel',
         handler: () => {
         }
       }
     ]
   });
   actionSheet.present();
 }
  
   takePicture(opt, sourceType){
     var options = {
      quality: 50,
      //allow: true,
      sourceType: sourceType,
      destinationType: Camera.DestinationType.DATA_URL,
      //saveToPhotoAlbum: false,
      //encodingType: Camera.EncodingType.JPEG,
      targetWidth: 1000,
      targetHeight: 1000
    };
    Camera.getPicture(options).then((imagePath) => {
      // imageData is a base64 encoded string
        if(this.opt == 0) {
          this.backimage = "data:image/jpeg;base64," + imagePath;
          $('#back_img1').css('background-image', 'url('+this.backimage+')');
        } else {
          this.image = "data:image/jpeg;base64," + imagePath;
          $('#image1').attr('src', this.image);
        }
        //var currentName = imagePath.substr(imagePath.lastIndexOf('/') + 1);
        //var correctPath = imagePath.substr(0, imagePath.lastIndexOf('/') + 1);
        //this.copyFileToLocalDir(correctPath, currentName, this.createFileName());
    }, (err) => {
       if(this.opt == 0) {
        this.backimage = null;
       } else {
         this.image = null;
       }
      console.log(err);
    });
  }

  ionViewWillEnter() {
    this.file_image_back = null;
    this.file_image = null;
    this.bedit = true;
    
    if(this.bedit) { 
      $('#back_img1').css('background-image', 'url('+this.data.job_job_background_url+')');
      $('#image1').attr('src', this.data.job_job_avatar_url);
      this.company_name = this.data.job_company_name;
      this.job_title = this.data.job_job_title;
      this.job_desc = this.data.job_job_description;
      this.job_req = this.data.job_job_requirement;
      this.job_industry = this.data.job_job_industry;
      this.job_time = this.data.job_time_available;
      this.job_location = this.data.job_location_address;
    }
  }
  getDataUri(url, callback) {
      var image = new Image();
      image.crossOrigin="anonymous";

      image.onload = function () {
          var canvas = document.createElement('canvas');
          canvas.width = image.naturalWidth; // or 'width' if you want a special/scaled size
          canvas.height = image.naturalHeight; // or 'height' if you want a special/scaled size

          canvas.getContext('2d').drawImage(image, 0, 0);

          var dataURL = canvas.toDataURL("image/png");
          dataURL = dataURL.replace(/^data:image\/(png|jpg);base64,/, "");
          callback(dataURL);
          /*
          // Get raw image data
          callback(canvas.toDataURL('image/png').replace(/^data:image\/(png|jpg);base64,/, ''));

          // ... or get as Data URI
          callback(canvas.toDataURL('image/png'));
          */
      };

      image.src = url;
  }
  

  upload_back() {
    this.fileInput.nativeElement.click();
  }
  setFileBack(event) { 
    this.file_image_back = event.srcElement.files[0];
    var file    = this.file_image_back;
    var reader  = new FileReader();

    reader.addEventListener("load", function () {
      $('#back_img1').css('background-image', 'url('+reader.result+')');
    }, false);

    if (file) {
      reader.readAsDataURL(file);
    }
  }

  upload_image() {
    this.fileInput1.nativeElement.click();
  }
  setFileImage(event) { 
    this.file_image = event.srcElement.files[0];
    var file    = this.file_image;
    var reader  = new FileReader();

    reader.addEventListener("load", function () {
      $('#image1').attr('src', reader.result);
    }, false);

    if (file) {
      reader.readAsDataURL(file);
    }
  }

  post() {
    if(!(this.bedit)) {
      if(this.file_image == null) {
        this.util.createAlert("Error", "Please insert your company image!");
        return;
      }
      if(this.file_image == null) {
        this.util.createAlert("Error", "Please insert your background image!");
        return;
      }
    }
    if(this.company_name == "") {
      this.util.createAlert("Error", "Please insert your Company name!");
      return;
    }
    if(this.job_title == "") {
      this.util.createAlert("Error", "Please insert your Job title!");
      return;
    }
    if(this.job_desc == "") {
      this.util.createAlert("Error", "Please insert your Job description!");
      return;
    }
    if(this.job_req == "") {
      this.util.createAlert("Error", "Please insert your Job  requirement!");
      return;
    }

    let user_info = JSON.parse(localStorage.getItem('user_info'));
    let user_name = user_info.user_name;
    let job_id = "";
    if(this.bedit) {
      job_id = this.data.job_id;
    }
    console.log(this.data);
    
    let param = {"avatar" : this.image, "background" : this.backimage, "employer_id" : this.config.user_id, "employer_name" : user_name, "company_name" : this.company_name, "job_title" : this.job_title, "job_description" : this.job_desc, "job_requirement" : this.job_req, "time_available" : this.job_time, "industry" : this.job_industry, "location_address" : this.data.job_location_address, "location_lat" : this.data.job_location_lat, "location_lng" : this.data.job_location_lng, "job_id" : job_id};
    
    let loader = this.loading.create({
      content: 'Loading...',
    });
    loader.present();

    if(this.bedit) {
      this.employerService.postData("editjob1", param)
      .subscribe(data => { console.log(data);
          loader.dismissAll();
          if(data.status == "success") {
            this.navCtrl.pop();
          } else {
            this.util.createAlert("Job Edit Failed", data.result);
          }
      }, err => {
        loader.dismissAll();
        this.util.createAlert("Failed", "Server error");
      })
    }
  }

  jobLocation() {
    this.navCtrl.push(EmployerEditjobLocationPage, {data: this.data});
  }

  deleteJob() {
    let loader = this.loading.create({
      content: 'Loading...',
    });
    loader.present();

    let param = {"job_id" : this.data.job_id};
    this.employerService.postData("deletejob", param)
    .subscribe(data => { console.log(data);
        loader.dismissAll();
        if(data.status == "success") {
          this.navCtrl.pop();
        } else {
          this.util.createAlert("Job Delete Failed", data.result);
        }
    })
  }

}
