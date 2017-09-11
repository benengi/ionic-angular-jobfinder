import { Component  } from '@angular/core';
import { NavController, LoadingController } from 'ionic-angular';
import { Config } from '../../../provider/config';
import { UtilService } from '../../../provider/util-service';
import { Auth } from '../../../provider/auth';

@Component({
  selector: 'page-employer-activity',
  templateUrl: 'employer-activity.html'
})
export class EmployerActivityPage {

  constructor(public navCtrl: NavController, 
    public config: Config,
    public util: UtilService,
    public auth: Auth,
    public loading: LoadingController) {
        
  }

}
