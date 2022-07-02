import { Variable } from '@angular/compiler/src/render3/r3_ast';
import { Component, OnInit, ViewChild } from '@angular/core';
import { DatePipe } from '@angular/common';
import {OverlayPanelModule} from 'primeng/overlaypanel';
import { Table } from 'primeng/table';
import * as Realm from "realm-web";

@Component({
  selector: 'app-main-page',
  templateUrl: './main-page.component.html',
  styleUrls: ['./main-page.component.css']
})
export class MainPageComponent implements OnInit {

  constructor() { 
  }
  filterInput: any 
  today = true
  overview = false
  food = false
  foodObject = {
    MEAL:'',
    NAME: '',
    CALORIES: null,
    PROTEIN: null,
    EDIT: false
  }

  foodTableValues: any[] = []
  testFoodTableValues: any[] = [
    {NAME: 'Test', CALORIES: '100', PROTEIN: '20', WEIGHT: ''},
    {NAME: 'Test1', CALORIES: '100', PROTEIN: '30', WEIGHT: ''},
    {NAME: 'Test2', CALORIES: '100', PROTEIN: '40', WEIGHT: ''},
    {NAME: 'Test3', CALORIES: '100', PROTEIN: '50', WEIGHT: ''}

  ]
  foodTableCols: any[] = []
  
  BREAKFAST: any[] = []
  editFoodText = 'Edit'
  LUNCH: any[] = []
  DINNER: any[] = []
  SNACKS: any[] = []
  dateTableValues: any[] = []
  dateTableCols: any[] = []
  day = {
    DATE: '',
    WEIGHT: null,
    food : {
      BREAKFAST: this.BREAKFAST,
      LUNCH: this.LUNCH,
      DINNER: this.DINNER,
      SNACKS : this.SNACKS,
    },
    CALORIES_TOTAL: 0,
    PROTEIN: 0,
    WORKOUT: '',
  }
  date: any
  formattedDate: any
  addFoodMode = 'Existing'
  user:any
  @ViewChild("foodTable") foodTable: Table;
  async ngOnInit(): Promise<void> {
    this.testCases()
    this.login()
    this.setTabs()
  }

  testCases(){
    this.foodTableValues = this.testFoodTableValues
  }
  async login(){
    const app = new Realm.App({ id: "application-0-yprqw" });
    const credentials = Realm.Credentials.anonymous();
    try {
      this.user = await app.logIn(credentials);
      console.log('test')
      const allFood = await this.user.functions['getAllFood']()
      this.foodTableValues = allFood
      console.log(allFood)
      this.dateTableValues = await this.user.functions['getAllDates']() 
      this.setDate()
    } catch(err) {
      console.error("Failed to log in", err);
    }
  }

  async setDate(){
    this.date = Date.now()
    const datepipe: DatePipe = new DatePipe('en-US')
    console.log(datepipe)
    this.formattedDate = datepipe.transform(this.date, 'dd-MMM-YYYY')
    let dateIndex=this.dateTableValues.findIndex(date=>date.DATE==this.formattedDate); console.log(dateIndex)
    this.foodObject.MEAL = 'Breakfast'
    if(dateIndex>-1){
     console.log(this.dateTableValues[dateIndex])
     this.day = this.dateTableValues[dateIndex]
     this.BREAKFAST = this.day.food.BREAKFAST
     this.LUNCH = this.day.food.LUNCH
     this.DINNER = this.day.food.DINNER
     this.SNACKS = this.day.food.SNACKS

     console.log(this.day)
    } else if(dateIndex==-1){
      this.day.DATE = this.formattedDate
      this.dateTableValues.push(this.day)
      await this.user.functions['addDate'](this.day); 
      console.log(this.dateTableValues)
    }
    //let formattedDate = datepipe.transform(yourDate, 'dd-MMM-YYYY HH:mm:ss')

  }
  setTabs(){
    this.foodTableCols = [
      { field: 'NAME', searchfield: 'NAME', header: 'Name', width: '25%', filterMatchMode:'contains', inputValue:null}, //0
      { field: 'CALORIES', searchfield: 'CALORIES', header: 'Calories', width: '25%', filterMatchMode:'contains', inputValue:null}, //1
      { field: 'PROTEIN', searchfield: 'PROTEIN', header: 'Protein (g)', width: '25%', filterMatchMode:'contains',inputValue:null }, //2
      { field: 'WEIGHT', searchfield: 'weight', header: 'Weight (g)', width: '25%', filterMatchMode:'contains',inputValue:null }, //2

    ]
    this.dateTableCols = [
      { field: 'DATE', searchfield: 'DATE', header: 'Date', width: '20%', filterMatchMode:'contains', inputValue:null}, //0
      { field: 'WEIGHT', searchfield: 'WEIGHT', header: 'Weight', width: '20%', filterMatchMode:'contains', inputValue:null}, //1
      { field: 'CALORIES_TOTAL', searchfield: 'CALORIES_TOTAL', header: 'Total Calories', width: '20%', filterMatchMode:'contains',inputValue:null }, //2
      { field: 'PROTEIN', searchfield: 'PROTEIN', header: 'Protein', width: '20%', filterMatchMode:'contains',inputValue:null }, //2
      { field: 'WORKOUT', searchfield: 'WORKOUT', header: 'Workout', width: '20%', filterMatchMode:'contains',inputValue:null }, //2

    ]
  }
  insertOne(name:any, foodObject: any){
    console.log(name)
    console.log(foodObject)
    const allFood = this.user.functions['updateFood'](name, foodObject)
    console.log(allFood)
  }
  setTab(Tab: any){
    if(Tab == 'Today'){
      this.today = true
      this.overview = false
      this.food = false
    }
    if(Tab == 'Overview'){
      this.today = false
      this.overview = true
      this.food = false
    }
    if(Tab == 'Food'){
      this.today = false
      this.overview = false
      this.food = true
    }

  }

  addFoodExisting(name: any, calories: any, protien: any, meal: any, weight: any){
    let existingFoodObject = {
      MEAL: meal,
      NAME: name,
      CALORIES: calories * weight,
      PROTEIN: protien * weight,
      WEIGHT: weight,
      EDIT: false,

    }
    console.log(existingFoodObject)
    console.log(this.foodObject.MEAL)
    //this.insertOne(this.foodObject.NAME,this.foodObject)
    if(this.foodObject.MEAL=='Breakfast'){  
      this.BREAKFAST.push(JSON.parse(JSON.stringify(existingFoodObject)))
    }
    if(this.foodObject.MEAL=='Lunch'){  
      this.LUNCH.push(JSON.parse(JSON.stringify(existingFoodObject)))
    }
    if(this.foodObject.MEAL=='Dinner'){  
      this.DINNER.push(JSON.parse(JSON.stringify(existingFoodObject)))
    }
    if(this.foodObject.MEAL=='Snacks'){  
      this.SNACKS.push(JSON.parse(JSON.stringify(existingFoodObject)))
    }
    this.day.CALORIES_TOTAL = this.day.CALORIES_TOTAL + Number(existingFoodObject.CALORIES) * weight
    this.day.PROTEIN = this.day.PROTEIN + Number(existingFoodObject.PROTEIN) * weight
    //this.saveDay(this.formattedDate, this.day);
  }

  addFood(save: any){
    if(save == true){
      this.insertOne(this.foodObject.NAME,this.foodObject)
      this.foodTableValues.push(JSON.parse(JSON.stringify(this.foodObject)))
    }
    console.log(this.foodObject)
    console.log(this.foodObject.MEAL)
    if(this.foodObject.MEAL=='Breakfast'){  
      this.BREAKFAST.push(JSON.parse(JSON.stringify(this.foodObject)))
    }
    if(this.foodObject.MEAL=='Lunch'){  
      this.LUNCH.push(JSON.parse(JSON.stringify(this.foodObject)))
    }
    if(this.foodObject.MEAL=='Dinner'){  
      this.DINNER.push(JSON.parse(JSON.stringify(this.foodObject)))
    }
    if(this.foodObject.MEAL=='Snacks'){  
      this.SNACKS.push(JSON.parse(JSON.stringify(this.foodObject)))
    }
    this.day.CALORIES_TOTAL = this.day.CALORIES_TOTAL + Number(this.foodObject.CALORIES)
    this.day.PROTEIN = this.day.PROTEIN + Number(this.foodObject.PROTEIN)
    this.saveDay(this.formattedDate, this.day);
  }

  toggleFoodEdit(arr: any, i: number){
    arr[i].EDIT = !arr[i].EDIT
  }

  editWeightText = 'Save'
  saveWeight(name: any, dateObject: any){
    console.log(name)
    console.log(dateObject)
    const dates = this.user.functions['updateDate'](name, dateObject)
    console.log(dates)
    //console.log(this.editWeightText)
    if(this.editWeightText == 'Save'){
      this.editWeightText = 'Edit'
    }
    else if(this.editWeightText == 'Edit'){
      this.editWeightText = 'Save'
    }
  }
  saveDay(name: any, dateObject:any){
    console.log(name)
    console.log(dateObject)
    const dates = this.user.functions['updateDate'](name, dateObject)
    console.log(dates)
  }
}
