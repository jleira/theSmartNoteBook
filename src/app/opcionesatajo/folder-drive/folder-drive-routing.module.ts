import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { FolderDrivePage } from './folder-drive.page';

const routes: Routes = [
  {
    path: '',
    component: FolderDrivePage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class FolderDrivePageRoutingModule {}
