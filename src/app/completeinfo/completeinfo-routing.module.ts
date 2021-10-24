import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { CompleteinfoPage } from './completeinfo.page';

const routes: Routes = [
  {
    path: '',
    component: CompleteinfoPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class CompleteinfoPageRoutingModule {}
