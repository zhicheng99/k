# element ui 表格动态生成多级表头，可无限嵌套

官网的写法是el-table-column下面嵌套el-table-column，如下：

![image-20260717172606222](D:\k\element-ui\assets\image-20260717172606222.png)

```html
<template>
  <el-table
    :data="tableData3"
    style="width: 100%">
    <el-table-column
      prop="date"
      label="日期"
      width="150">
    </el-table-column>
    <el-table-column label="配送信息">
      <el-table-column
        prop="name"
        label="姓名"
        width="120">
      </el-table-column>
      <el-table-column label="地址">
        <el-table-column
          prop="province"
          label="省份"
          width="120">
        </el-table-column>
        <el-table-column
          prop="city"
          label="市区"
          width="120">
        </el-table-column>
        <el-table-column
          prop="address"
          label="地址"
          width="300">
        </el-table-column>
        <el-table-column
          prop="zip"
          label="邮编"
          width="120">
        </el-table-column>
      </el-table-column>
    </el-table-column>
  </el-table>
</template>
12345678910111213141516171819202122232425262728293031323334353637383940
```

可以看出代码繁琐，重复量比较大，所以改造简单封装了下 将el-table和el-table-column独立出来 el-table封装如下： **MyTable.vue**

```html
<template>
  <div class="my-table">
    <el-table :data="data">
      <my-column v-for="(item,index) in col" :key="index" :col="item"></my-column>
    </el-table>
  </div>
</template>

<script>
import MyColumn from './MyColumn'
export default {
  components: {
    MyColumn
  },
  props: {
    col: {
      type: Array
    },
    data: {
      type: Array
    }
  }
}
</script>
<style scoped>
</style> 
```

el-table-column封装如下： **MyColumn.vue**

```html
<template>

  <el-table-column :prop="col.prop"
    :label="col.label"
    align="left">

    <template v-if="col.children">
      <my-column v-for="(item, index) in col.children"
        :key="index"
        :col="item"></my-column>
    </template>

  </el-table-column>
</template>

<script>
export default {
  name: 'MyColumn',
  props: {
    col: {
      type: Object
    }
  }
}
</script>
<style scoped>
</style>
123456789101112131415161718192021222324252627
```

**使用**

```html
<template>
  <div>
    <my-table :col="col"
      :data="data">
    </my-table>
  </div>
</template>

<script>
import MyTable from './MyTable'
export default {
  components: {
    MyTable
  },
  data() {
    return {
      col: [
        {
          prop: 'date',
          label: '日期'
        },
        {
          label: '配送信息',
          children: [
            {
              prop: 'name',
              label: '姓名'
            },
            {
              label: '地址',
              children: [
                {
                  prop: 'province',
                  label: '省份'
                },
                {
                  prop: 'city',
                  label: '市区'
                },
                {
                  prop: 'address',
                  label: '地址'
                }
              ]
            }
          ]
        }
      ],
      data: [
        {
          date: '2016-05-03',
          name: '王小虎',
          province: '上海',
          city: '普陀区',
          address: '上海市普陀区金沙江路 1518 弄',
          zip: 200333
        },
        {
          date: '2016-05-02',
          name: '王小虎',
          province: '上海',
          city: '普陀区',
          address: '上海市普陀区金沙江路 1518 弄',
          zip: 200333
        }
      ]
    }
  }
}
</script>
<style>
</style>
123456789101112131415161718192021222324252627282930313233343536373839404142434445464748495051525354555657585960616263646566676869707172
```

**效果图** ![element ui 表格动态生成多级表头，可无限嵌套](https://zhicheng99.github.io/book/Public/upload/20201119/16057765971.png) 简单封装后可以动态无限级生成嵌套的表头，唯一的一个不好的地方就是自定义模版无法用这种形式自定义模版了，不过可以用render+JSX解决，问题不大

```text
<template slot-scope="scope">
</template>
12
```

**在线预览** https://jsfiddle.net/xmwh/1spq0kcn/

文章来源：https://blog.csdn.net/liub37/article/details/82906141

实际项目中使用

```text
<template>
	<div class="p-t-10">
		<el-row class="m-b-20">
			<el-col :span="24" class="toolbar">
				<el-form :model="filters" @submit.native.prevent :inline="true" ref="filters"> 

					 <el-form-item label="活动:" :label-width="toolLabelWidth" prop="pid">
						<el-select size="small" v-model="filters.pid" placeholder="请选择活动" @change="handleCurrentChange(1)">
						    <el-option v-for="item in actList"
						        :key="item"
						        :label="item.title"
						        :value="item.id">
						    </el-option>
						</el-select>

					 </el-form-item> 
					<el-button class="m-t-5" size="small" :type="filters.tagCode == item.code?'primary':'button'" @click="select(item.code)" 
					v-for="item in honorList"
					:key="item"

					>{{item.label}}</el-button>

					<!--  <el-form-item>
					 <el-button    @click.native.prevent="handleCurrentChange(1)" size="small" icon="el-icon-search">查询</el-button>
					 </el-form-item> 
					 <el-form-item>
					 		<el-button size="small" icon="el-icon-refresh" @click="$refs.filters.resetFields()">重置</el-button>
					 </el-form-item>  -->
					<el-form-item class="p-l-5">
						<el-button  @click.native.prevent="exportXls" size="small" icon="el-icon-download" :loading="downloading">导出</el-button>
					</el-form-item>  
				</el-form>
			</el-col>
		</el-row>

		<!--列表-->
		<!-- <el-table :data="users" highlight-current-row v-loading="listLoading"   style="width: 100%;" >

			<el-table-column type="index"  width="80" label="序号">
				<template slot-scope="scope"><span>{{scope.$index+(page - 1) * size + 1}} </span></template>
			</el-table-column>

			<el-table-column prop="brand" label="案例品牌">
			</el-table-column> 

			<el-table-column prop="rank" label="终审排名" width="100">
			</el-table-column> 

			<el-table-column label="外部评审" align="center"> 
		
					<el-table-column prop="rank" label="终审排名" width="100">
					</el-table-column> 
 
						  
			</el-table-column>
			<el-table-column label="内部评审" align="center">
					<el-table-column label="张三" align="center">
			
					</el-table-column>
					<el-table-column label="李四" align="center">
			
					</el-table-column>
			</el-table-column>


			<el-table-column prop="num" label="内部评审平均分">
			</el-table-column>
			<el-table-column prop="num" label="最终得分">
			</el-table-column>
			<el-table-column  label="终审链接">
				<template slot-scope="scope">
					<a :href="scope.row.caseDataUrl" target="_blank">
			
					<el-button type="text">查看</el-button>
					</a>
				</template>
			</el-table-column>
 
		</el-table>

		<el-col :span="24" class="toolbar m-t-20" v-if="users.length>0">
			<el-pagination background layout="total,prev, pager, next" :current-page="page" @current-change="handleCurrentChange" :page-size="size" :total="total" style="float:right;">
			</el-pagination>
		</el-col> -->

		<div v-loading="listLoading">
			<my-table v-if="data.length>0"
	 		:col="col"
	 		:data="data"
	 		:page="page"
	 		:size="size"
	 		></my-table>

	 		<div class="text-center empty p-t-10 p-b-10" v-if="data.length==0">暂无数据</div>
		</div>
 
 

 		<el-col :span="24" class="toolbar m-t-20" v-if="data.length>0">
			<el-pagination background layout="total,prev, pager, next" :current-page="page" @current-change="handleCurrentChange" :page-size="size" :total="total" style="float:right;">
			</el-pagination>
		</el-col>



	</div>
</template>
<script>
	import config from '../../../common/js/config.js';
	import dic from '../../../common/js/dic.js';
	 
	import MyTable from '../../../components/review/MyTable.vue';
	import SecColumn from './SecColumn.vue'



	export default{
		components:{ 
			MyTable,
			SecColumn
		},
		props:[],
		data(){
			return {
				toolLabelWidth:config.toolbarLabelWidth,
				formLabelWidth:config.dialogLabelWidth,
				filters: { 
					pid:'',
					track:'1', 
					tagCode:''
				},
				users: [
					{
						brand:'fdsfd',
						fs:[
							{
								name:'张三',
								num:121
							}

						]
					}
				],
				total: 0,
				page: 1,
				size:10,
				listLoading: false,
				sels: [],//列表选中列 
 

				addVisible:false,
				editVisible:false,
				detailVisible:false,

	
				editForm:{
				},
				detailForm:{
				},
	
				actid:'',
				ImportReviewCaseVisible:false,
				downloading:false,

				honorList:[],

				col:[],
				colField: [
			         {
			          prop: 'xh',
			          label: '序号',
			          width:'60'
			        },
			        {
			          prop: 'brand',
			          label: '品牌',
			        }, 

			          {
			          prop: 'rank',
			          label: '终审排名',
			        },
			         {
			          label: '外部评审',
			          align: 'center',
			          children: [
			            {
			              prop: 'name',
			              label: '姓名'
			            },
			            {
			              label: '地址',
			              prop:'province'
			            }
			          ]
			        }, 
			        {
			          label: '内部评审',
			          align: 'center',

			          children: [
			            {
			              prop: 'name',
			              label: '姓名'
			            },
			            {
			              label: '地址',
			              prop:'province'
			            }
			          ]
			        },
			        {
			          prop: 'inAverage',
			          label: '内部平均分',
			        },
			        {
			          prop: 'endScore',
			          label: '最终得分',
			        },
			        // {
			        //   prop: 'rank',
			        //   label: '评语',
			        // },
			        {
			          prop: 'caseDataUrl',
			          label: '终审资料',
			          align:'center'
			        },
			      ],

			       data: [
			        // { 
			        //   date: '2016-05-03',
			        //   name: '王小虎',
			        //   province: '上海', 
			        //   brand:'品牌1',
			        //   rank:'排名',
			        //   xh:'1',
			        //   ps:[
			        //   	{
			        //   		name:'张三',
			        //   		pf:'10'
			        //   	},
			        //   	{
			        //   		name:'李四',
			        //   		pf:'10'
			        //   	}
			        //   ]
			        // },
			        // {
			        //   date: '2016-05-02',
			        //   name: '王小虎',
			        //   province: '上海', 
			        //   brand:'品牌2',
			        //   rank:'排名',
			        //   xh:'3',
			        //    ps:[
			        //   	{
			        //   		name:'张三',
			        //   		pf:'10'
			        //   	},
			        //   	{
			        //   		name:'李四',
			        //   		pf:'10'
			        //   	}
			        //   ]


			        // }
			      ],
			      actList:[]



			}
		},
		methods:{
			select:function(code){
				this.filters = {
					...this.filters,
					...{
						tagCode:code
					}
				} 

				this.handleCurrentChange(1);
			},
			exportXls:function(){
				let params = {  
					...this.filters,
				}
				this.downloading = true;
				this.$downXls('/admin/reviewData/case/exportRank',params,'评审结果导出').then(()=>{
					this.downloading = false;
				}).catch(()=>{

					this.downloading = false;
		
				})
			},
			handleCurrentChange(val) {
				this.page = val;
				this.getUsers();
			},
			getTableTitle:function(label){

				var index = -1;
				for (var i = 0; i < this.colField.length; i++) {
					if(this.colField[i].label == label){
						index = i;
						break;
					}
				}

				if(index != -1){
					return index;
				}else{
					return null;
				}

			},
			createUserField:function(data,field){
				var tmp = [];
				var s = data[0][field];
				for (var i = 0; i < s.length; i++) {
					tmp.push({
						label:s[i].judgesName,
						width:'80',
						prop:field=='outList'?'outList_'+i+'_num':'inList_'+i+'_num'
					})
				}


				return tmp;
			},
			createItemTitle:function(data){ 

				var tmp1 = this.getTableTitle('外部评审');
				var tmp2 = this.getTableTitle('内部评审');

 
				if(tmp1 !== null){
					this.colField[tmp1] = {
						...this.colField[tmp1],
						...{children:this.createUserField(data,'outList')}

					}
				}

				if(tmp2 !== null){
					this.colField[tmp2] = {
						...this.colField[tmp2],
						...{children:this.createUserField(data,'inList')}

					}
				}

				this.col = this.colField;

				console.log(this.colField);

			},

			createItemValue:function(data){

				for (var i = 0; i < data.length; i++) {
		
					data[i].outList.forEach((item,index)=>{

						data[i]['outList_'+index+'_num'] = item.num;
			
					})

					data[i].inList.forEach((item,index)=>{
			
						data[i]['inList_'+index+'_num'] = item.num;
			
					})

				}

			},
			//获取用户列表
			getUsers() {
				this.col = [];
				this.data = [];

				this.listLoading = true;
				let params = {

						...{current:this.page,
						size:this.size},
					...this.filters, 

				} 
				this.$post('/admin/reviewData/case/caseEffect',params).then((res)=>{
						 let { msg, code, obj } = res;

						 if(code == '00'){
							this.listLoading = false;
							this.total = obj.total;
							// this.page = Math.ceil(count/this.page);
				
							obj.records.forEach((item,index)=>{
								item.xh = index+(this.page - 1) * this.size + 1

								// item.scoreList = [
								// 	{
								// 		name:'张三',
								// 		num:10
								// 	},
								// 	{
								// 		name:'李四',
								// 		num:10
								// 	}
								// ];
								// item.scoreList1 = [
								// 	{
								// 		name:'王五',
								// 		num:10
								// 	},
								// 	{
								// 		name:'李四',
								// 		num:10
								// 	}
								// ]
							})

							obj.records.length>0 && 
							this.createItemValue(obj.records);


							obj.records.length>0 && 
							this.createItemTitle(obj.records);



							console.log(obj.records);

							this.data = obj.records;



						 }
				
						 
			
				}).catch(()=>{
					this.listLoading = false;


				})
			}

		},
		mounted(){

			var f1 =  new Promise((resolve, reject)=>{

				this.$post('/admin/reviewData/activity/page',{page:1,size:10000}).then(({code,data})=>{
				  
				    (code == '00') && (()=>{

				    	this.filters.pid = data[0].id;
				    	this.actList = data;
				    })()



					resolve();

				}).catch(()=>{
					reject()
				})
		  
		    })

		    var f2 = new Promise((resolve, reject)=>{

					// 提名奖项
					dic.ReviewTags(false,'4000010').then(res=>{
						let { msg, code, data } = res;


						this.filters.tagCode = data[0].code;
						// this.filters.tagCode = 400001003;

			
						this.honorList = data;


						resolve();
						// this.getUsers();

					}).catch(()=>{

						reject();

					})

		    })

		    Promise.all([f1,f2]).then(()=>{ 
			    console.log('callback')
				// this.getUsers();

			})
 
   

   

		},
		created(){

		},
		computed:{

		},
		watch:{
		}
	}

</script>
<style scoped>
.empty{
	font-size: 14px;
	color: #909399;
	background: #fff;
}
.tip {
	font-size: 12px;
	line-height: 16px;
	color: #999;
}
.tip i {
	color: #fc9153;
}
.op{
	font-size: 12px;
	color: #409eff;
	cursor: pointer;
}

</style>
```

MyTable.vue

```text
<template>
	<div>
		<el-table :data="data" highlight-current-row  style="width: 100%;" >

			<!-- 序号这一列 再加一次才可以排到第一位  
				不知道具体原因 所以得用样式再把它隐藏掉
			-->
			<el-table-column width="1" label="序号" prop="xh" class-name="hide_column">
			</el-table-column>


			<my-column 
			v-for="(item,index) in col" 
			:key="item"
			:index="index" 
			:col="item"
			></my-column> 

		</el-table> 
	</div>
</template>
<script>
	import MyColumn from './MyColumn.vue'
	export default{
		name: 'MyTable',
		components:{
			MyColumn
		},
		props:['data','col','page','size'],
		data(){
			return {
			}
		},
		methods:{

		},
		mounted(){


		},
		created(){
	
		},
		computed:{

		},
		watch:{
	
		}
	}

</script>
<style scoped>

</style>
<style>
	.hide_column{
		width: 0;
		display: none;
	}
</style>
```

MyColumn.vue

```text
<template>
	<div>

		 
		<template v-if="col.label=='终审资料'">
			<el-table-column
		    :label="col.label" :key="col"
		    :align="col.align?col.align:'left'" :width="col.width?col.width:''"> 
		    	<template slot-scope="scope">
		    		<a :href="scope.row.caseDataUrl" target="_blank">
		    		  <el-button size="mini" type="text">查看</el-button>
		    		</a>
		    	</template>
			</el-table-column>
		</template>
		<template v-else>
			<el-table-column :prop="col.prop"
		    :label="col.label" :key="col"
		    :align="col.align?col.align:'left'" :width="col.width?col.width:''"> 
 	
		    <template v-show="col.children" >

		      <my-column v-for="(item, index) in col.children"
		        :key="item"
		        :col="item"></my-column>

		    </template>

		</el-table-column>
	
		</template>
	

	</div>
</template>
<script>
	export default{
		name: 'MyColumn',
		components:{},
		props:['col','index'],
		data(){
			return {

			}
		},
		methods:{
			isArr:function(prop){

				return Object.prototype.toString.call(prop)==='[object Array]';
			}
		},
		mounted(){

		},
		created(){
	
		},
		computed:{

		},
		watch:{

			'col':function(v){
				console.log(v);
			}

		}
	}

</script>
<style scoped>

</style>
```
