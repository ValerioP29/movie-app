import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MaterialModule } from '../material-angular/material.module';
import { UsersRoutingModule } from './users-routing.module';
import { UsersListComponent } from './users-list/users-list.component';
import { RouterModule } from '@angular/router';

@NgModule({
  declarations: [
    UsersListComponent
  ],
  imports: [
    CommonModule,
    UsersRoutingModule,
    RouterModule.forChild([{ path: '', component: UsersListComponent }]),
    MaterialModule
  ]
})
export class UsersModule { }
