import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  {
    path: '',
    loadChildren: () => import('./tabs/tabs.module').then(m => m.TabsPageModule)
  },
  {
    path: 'login/:qrtext',
    loadChildren: () => import('./login/login.module').then( m => m.LoginPageModule)
  },
  {
    path: 'intro',
    loadChildren: () => import('./intro/intro.module').then( m => m.IntroPageModule)
  },
  {
    path: 'configuracion',
    loadChildren: () => import('./configuracion/configuracion.module').then( m => m.ConfiguracionPageModule)
  },
  {
    path: 'prelogin',
    loadChildren: () => import('./prelogin/prelogin.module').then( m => m.PreloginPageModule)
  },
  {
    path: 'singup/:qrtext',
    loadChildren: () => import('./singup/singup.module').then( m => m.SingupPageModule)
  },
  {
    path: 'completeinfo/:origen/:qrtext',
    loadChildren: () => import('./completeinfo/completeinfo.module').then( m => m.CompleteinfoPageModule)
  },
  {
    path: 'pagedetail/:id',
    loadChildren: () => import('./pagedetail/pagedetail.module').then( m => m.PagedetailPageModule)
  },
  {
    path: 'opcionesatajo',
    loadChildren: () => import('./opcionesatajo/opcionesatajo.module').then( m => m.OpcionesatajoPageModule)
  },
  {
    path: 'agendartarea',
    loadChildren: () => import('./agendartarea/agendartarea.module').then( m => m.AgendartareaPageModule)
  },
  {
    path: 'recuperarcontrasena',
    loadChildren: () => import('./recuperarcontrasena/recuperarcontrasena.module').then( m => m.RecuperarcontrasenaPageModule)
  }
];
@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule {}
