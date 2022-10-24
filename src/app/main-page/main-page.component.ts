import { Variable } from '@angular/compiler/src/render3/r3_ast';
import { Component, OnInit, ViewChild, Input} from '@angular/core';
import { DatePipe } from '@angular/common';
import {OverlayPanelModule} from 'primeng/overlaypanel';
import { Table } from 'primeng/table';
import * as Realm from "realm-web";
import {ChartModule} from 'primeng/chart';

@Component({
  selector: 'app-main-page',
  templateUrl: './main-page.component.html',
  styleUrls: ['./main-page.component.css']
})
export class MainPageComponent implements OnInit {
  @Input() item = ''; 
  chartData: any;
  multiAxisOptions: any;
  constructor() { 
    this.chartData = {
      labels: ['January', 'February', 'March', 'April', 'May', 'June', 'July'],
      datasets: [
          {
              label: 'Weight',
              data: this.weightData
          },
          {
              label: 'Calories',
              data: []
          },         
      ]
  }
  }

  filterInput: any 
  today = true
  overview = false
  food = false
  foodObject = {
    MEAL:'',
    NAME: '',
    CALORIES: null,
    FAT: null,
    PROTEIN: null,
    SODIUM: null,
    POTASSIUM: null,
    CARBS: null,
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
  addfoodTableCols: any[] = []
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
    USERID: '',
  }
  date: any
  formattedDate: any
  addFoodMode = 'Existing'
  user:any
  @ViewChild("foodTable") foodTable: Table;
  async ngOnInit(): Promise<void> {
    //this.testCases()
    this.login()
    this.setTabs()
  }

  testCases(){
    this.foodTableValues = this.testFoodTableValues
  }
  async login(){
    console.log(this.item)
    this.day.USERID = this.item
    console.log(this.day)
    const app = new Realm.App({ id: "application-0-yprqw" });
    const credentials = Realm.Credentials.anonymous();
    try {
      this.user = await app.logIn(credentials);
      console.log('test')
      //const user = await this.user.functions['verifyLogin']('admin','Welcome123!')
      const allFood = await this.user.functions['getAllFood']()
      this.foodTableValues = allFood
      console.log(allFood)
      this.dateTableValues = await this.user.functions['getAllDates'](this.item) 
      this.sortDateVals()
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
     if(this.day.WEIGHT!=''){
      this.editWeightText = 'Edit'
     }
     this.BREAKFAST = this.day.food.BREAKFAST
     this.LUNCH = this.day.food.LUNCH
     this.DINNER = this.day.food.DINNER
     this.SNACKS = this.day.food.SNACKS
     console.log(this.day)
    } else if(dateIndex==-1){
      this.day.DATE = this.formattedDate
      this.day.USERID = this.item
      this.dateTableValues.push(this.day)
      await this.user.functions['addDate'](this.day); 
      console.log(this.dateTableValues)
    }
    //let formattedDate = datepipe.transform(yourDate, 'dd-MMM-YYYY HH:mm:ss')
  }

  weightData: any[] = []
  caloriesData: any[] = []
  sortDateVals(){
    while(this.weightData.length!=0){
      this.weightData.pop()
    }
    console.log(this.weightData)
    console.log(this.dateTableValues)
    for(let i=0; i <this.dateTableValues.length; i++){
      this.weightData.push(this.dateTableValues[i].WEIGHT)
      console.log(this.dateTableValues[i].WEIGHT)
      //this.caloriesData.push()
    }
  }

  setTabs(){
    this.foodTableCols = [
      { field: 'NAME', searchfield: 'NAME', header: 'Name', width: '16%', filterMatchMode:'contains', inputValue:null}, //0
      { field: 'CALORIES', searchfield: 'CALORIES', header: 'Calories', width: '16%', filterMatchMode:'contains', inputValue:null}, //1
      { field: 'PROTEIN', searchfield: 'PROTEIN', header: 'Protein', width: '16%', filterMatchMode:'contains',inputValue:null }, //2
      { field: 'FAT', searchfield: 'FAT', header: 'Fat', width: '16%', filterMatchMode:'contains',inputValue:null }, //3
      { field: 'SODIUM', searchfield: 'SODIUM', header: 'Sodium', width: '16%', filterMatchMode:'contains',inputValue:null }, //4
      { field: 'POTASSIUM', searchfield: 'POTASSIUM', header: 'Potassium', width: '16%', filterMatchMode:'contains',inputValue:null }, //5
      { field: 'CARBS', searchfield: 'CARBS', header: 'Carbs', width: '16%', filterMatchMode:'contains',inputValue:null }, //6
    ]
    this.addfoodTableCols = [
      { field: 'NAME', searchfield: 'NAME', header: 'Name', width: '25%', filterMatchMode:'contains', inputValue:null}, //0
      { field: 'CALORIES', searchfield: 'CALORIES', header: 'Calories', width: '25%', filterMatchMode:'contains', inputValue:null}, //1
      { field: 'PROTEIN', searchfield: 'PROTEIN', header: 'Protein', width: '25%', filterMatchMode:'contains',inputValue:null }, //2
      { field: 'WEIGHT', searchfield: 'weight', header: 'Weight', width: '25%', filterMatchMode:'contains',inputValue:null }, //3
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
    this.foodTableValues.push(JSON.parse(JSON.stringify(this.foodObject)))
    console.log(foodObject)
    const allFood = this.user.functions['updateFood'](name, foodObject)
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

  table = true
  chart: boolean
  existing = true
  new: boolean
  setSubTab(subTab: any){
    if(subTab == 'table'){
      this.table = true
      this.chart = false
    }
    if(subTab == 'chart'){
      this.table = false
      this.chart = true
    }
    if(subTab == 'existing'){
      this.existing = true
      this.new = false
    }
    if(subTab == 'new'){
      this.existing = false
      this.new = true
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
    this.day.CALORIES_TOTAL = this.day.CALORIES_TOTAL + Number(existingFoodObject.CALORIES)
    this.day.PROTEIN = this.day.PROTEIN + Number(existingFoodObject.PROTEIN) 
    //this.saveDay(this.formattedDate, this.day);
    this.saveDay(this.formattedDate, this.day)
  }

  addFood(){
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
    //console.log(this.editWeightText)
    if(this.editWeightText == 'Save'){
      this.sortDateVals()
      console.log(name)
      console.log(dateObject)
      console.log(this.day)
      const dates = this.user.functions['updateDate'](name, dateObject)
      console.log(dates)
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
