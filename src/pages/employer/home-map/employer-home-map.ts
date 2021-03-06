import { Component , ViewChild, ElementRef } from '@angular/core';
import { NavController, LoadingController, Slides, ViewController } from 'ionic-angular';
import { Config } from '../../../provider/config';
import { EmployerInvitePage } from '../invite/employer-invite';
import { EmployerSavedPage } from '../saved/employer-saved';
import { EmployerSeekerDetailPage } from '../detail/employer-seeker-detail';
import { UtilService } from '../../../provider/util-service';
import { EmployerService } from '../../../provider/employer-service';
import $ from 'jquery';
declare var google;

@Component({
  selector: 'page-employer-home-map',
  templateUrl: 'employer-home-map.html'
})
export class EmployerHomeMapPage {

  arrIndustry = [];
  arrCertification = [];
  arrInterest = [];
  list: any;
  slist: any;
  showSearch = false;

  ttime = 300;
  @ViewChild('slides') slides: Slides;
  @ViewChild('map') mapElement: ElementRef;
  map: any;

  constructor(public navCtrl: NavController, 
    public config: Config,
    public util: UtilService,
    public employerService: EmployerService,
    public viewCtrl: ViewController,
    public loading: LoadingController) {
        
        this.arrIndustry = ["#hospitality", "#entertainment", "#fastfood", "#construction", "#sales", "#retail", "#notforprofit", "#logistics", "#administration", "#agedcare", "#banking", "#callcentre", "#childcare", "#consumergoods", "#creative", "#defence", "#education", "#entrepreneur", "#financialservices", "#government", "#healthcare", "#hr", "#legal", "#manufacturing", "#marketing", "#media", "#mining", "#officesupport", "#professionalservices", "#property", "#recreation", "#recruitment", "#selfemployed", "#software", "#sports", "#technicalsupport", "#technology", "#telecommunications", "#tourism", "#trades", "#transport", "#cleaning", "#fashion", "#hairandbeauty", "#services"];

        this.arrCertification = ["#Sijil Kemahiran Malaysia ( SKM 1 )", "#Sijil Kemahiran Malaysia ( SKM 2 )", "#Sijil Kemahiran Malaysia ( SKM 3)", "#Diploma Kemahiran Malaysia ( DKM )", "#Diploma Lanjutan Kemahiran Malaysia ( DLKM )", "#IEP/IELTS", "#Certification in Early Childhood Education", "#Certification in English", "#ESOL UK", "#PCIF", "#TEFL (LTTC) UK", "#Certificate in Outsourcing Professional ( COP )", "#Professional Engineer ( PE )", "#CEng", "#CSci", "#CEnv", "#CEng", "#CSDA", "#CSDP", "#WCET", "#CCP", "#IPPC", "#CQIF", "#IFP", "#CFP", "#ACCA", "#CPA", "#CFA", "#CIMA", "#ACA", "#CFE", "#CIA", "#CISA", "#Microsoft Professional Certification", "#Oracle Professional Certification", "#CISCO Professional Certification", "#CIPD Level 3", "#CIPD Level 5", "#CIPD Level 7", "#CHA", "#SCAE Barista Basic", "#SCAE Barista Intermediate", "#SCAE Barista Professional", "#Latte Art Basic", "#Latte Art Advanced", "#Mixologist", "CIDB Green Card"];

        this.arrInterest = ["#Reading", "#Travelling", "#Blogging", "#Collecting", "#Volunteer Work/Community", "#Cooking", "#Child Care", "#Sports", "#Music", "#Puzzles and Strategy games", "#Club memberships", "#Public speaking", "#Board games", "#Photography", "#Art & Cultural pursuits", "#Gardening", "#Others"]

  }

  ionViewWillEnter() {
    this.loadData();
  }
  
  change(value) {
    this.loadData();
  }

  loadData() {
    let user_setting = JSON.parse(localStorage.getItem('user_setting'));
    let loader = this.loading.create({
      content: 'Loading...',
    });
    loader.present();
    let param = {"employer_id" : this.config.user_id, "industry" : this.config.queryIndustry, "experience_city" : this.config.queryExperienceCity, "experience_country" : this.config.queryExperienceCountry, "experience_role" : this.config.queryExperienceRole, "curwork_city" : this.config.queryCurWorkCity, "curwork_country" : this.config.queryCurWorkCountry, "curwork_role" : this.config.queryCurWorkRole, "education" : this.config.queryEducation, "language" : this.config.queryLanguage, "certificate" : this.config.queryCertificate, "interest" : this.config.queryInterest};
    this.employerService.loadMatchedJobSeekers(param)
    .subscribe(data => {
        loader.dismissAll();
        if(data.status = "success") {
          this.list = data.result; console.log(this.list);
          for(let i=0; i<this.list.length; i++) {
            let item = this.list[i];
            this.list[i]['distance'] = this.config.calcCrow(this.list[i].setting_location_lat, this.list[i].setting_location_lng, user_setting.setting_emp_location_lat, user_setting.setting_emp_location_lng);
          }
          this.search("");
          this.loadMap();
        }
    })
  }

  loadMap(){
    let user_setting = JSON.parse(localStorage.getItem('user_setting'));
    console.log(user_setting);
    let latLng = new google.maps.LatLng(user_setting.setting_emp_location_lat, user_setting.setting_emp_location_lng);
    let mapOptions = {
      center: latLng,
      zoom: 15,
      mapTypeId: google.maps.MapTypeId.ROADMAP
    }
    this.map = new google.maps.Map(this.mapElement.nativeElement, mapOptions);
    var marker = new google.maps.Marker({
        map: this.map,
        position: latLng
    });

    var infowindow = null;
    
    google.maps.event.addListener(marker, 'click', function() {
        if(infowindow == null) {
            infowindow = new google.maps.InfoWindow({
                map: this.map,
                position: latLng,
                content: user_setting.setting_emp_location_address
            });
        }
        infowindow.open(this.map, this);
    });
    //console.log(user_setting);
    let rd = user_setting.setting_distance; 
    rd = rd*0.621371*1609.3; 
    var circle = new google.maps.Circle({
        map: this.map,
        radius: rd,    // 
        fillColor: '#3ac7f3',
        strokeColor: '#3ac7f3'
    });
    circle.bindTo('center', marker, 'position');
    
    //========================
    let list = this.slist;
    var mark = [];
    var ll = [];
    var ct = [];
    for(let i=0; i<list.length; i++) {
        let item = list[i];
        let im = item.user_avatar_url;
        var icon = {
            url: im, // url
            scaledSize: new google.maps.Size(50, 50), // scaled size
            origin: new google.maps.Point(0,0), // origin
            anchor: new google.maps.Point(0, 0) // anchor
        };
        ll[i] = new google.maps.LatLng(item.setting_location_lat, item.setting_location_lng);
        mark[i] = new google.maps.Marker({
            map: this.map,
            position: ll[i],
            icon: icon
        });
        ct[i] = item.user_name;
    }
    var infow = [];
    var self = this;
    for(let i=0; i<list.length; i++) {
        infow[i] = null
        google.maps.event.addListener(mark[i], 'click', function() {
            if(infow[i] == null) {
                infow[i] = new google.maps.InfoWindow({
                    map: this.map,
                    position: ll[i],
                    content: "<div class='div_info' id='div_"+i+"'>"+ct[i]+"<br/><small>"+self.config.calcCrow(self.list[i].setting_location_lat, self.list[i].setting_location_lng, user_setting.setting_emp_location_lat, user_setting.setting_emp_location_lng)+"</small><div>"
                });
            } else {
                
            }
            infow[i].open(this.map, this);
            google.maps.event.addListener(infow[i], 'domready', function() {
                $('#div_'+i).click(function(){
                    self.goSeeker(i);
                })
            });
        });
        
    }
  }

  goSeeker(i) {
    let seekerID = this.list[i].user_id;
    this.navCtrl.push(EmployerSeekerDetailPage, {seeker_id: seekerID});
  }

  goList() {
      this.viewCtrl.dismiss();
  }

  goLiked() {
    this.navCtrl.push(EmployerSavedPage);
  }

  asearch() {
    this.showSearch = true;
  }
  cancel() {
    this.showSearch = false;
  }
  done() {
    this.showSearch = false;
    this.loadData();
  }

  search(value) {
    value = this.config.searchValue;
    this.slist = this.filterItems(value);
    this.loadMap();
  }
  filterItems(searchTerm) {
    return this.list.filter((item) => {
      for(var key in item) { 
        if(item[key].toLowerCase().indexOf(searchTerm.toLowerCase()) > -1) {
          return true;
        }
      }
      return false;
    })
  }
}
