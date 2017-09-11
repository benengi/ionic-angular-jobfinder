import { Component  } from '@angular/core';
import { NavController, LoadingController } from 'ionic-angular';
import { Config } from '../../../provider/config';
import { UtilService } from '../../../provider/util-service';
import { Auth } from '../../../provider/auth';

@Component({
  selector: 'page-employer-home',
  templateUrl: 'employer-home.html'
})
export class EmployerHomePage {

  constructor(public navCtrl: NavController, 
    public config: Config,
    public util: UtilService,
    public auth: Auth,
    public loading: LoadingController) {
        
  }

}
