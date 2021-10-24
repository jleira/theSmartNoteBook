import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { OpcionesatajoPage } from './opcionesatajo.page';

const routes: Routes = [
  {
    path: '',
    component: OpcionesatajoPage
  },
  {
    path: 'folder-drive',
    loadChildren: () => import('./folder-drive/folder-drive.module').then( m => m.FolderDrivePageModule)
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class OpcionesatajoPageRoutingModule {}
