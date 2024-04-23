from flask import Flask ,request, jsonify,send_file
from flask_cors import CORS, cross_origin
from werkzeug.utils import secure_filename
from tinydb import TinyDB,Query,storages
import os 
import json
import copy
import csv
import re
from copy import deepcopy

app =Flask(__name__)

CORS(app)

Storage_Folder = "Storage"

if not os.path.exists(Storage_Folder):
    os.makedirs(Storage_Folder) 



# Create a DataBase for Modules
db = TinyDB(f"./{Storage_Folder}/modules.json")
Users = db.table("users")
   

   
ModuleInfo = db.table("ModulesInfo")

ModuleRecord = ModuleInfo.all()

# All Module Names
ModuleNameList = [module["moduleName"] for module in ModuleRecord]
MainModuleList = [module["moduleName"] for module in ModuleRecord if "mainModule" not in module.keys()]

print(ModuleNameList)
print(MainModuleList)


def RemoveUnderScore(data):
    return {key.split("_")[-1] for key in data.keys()}



def get_module_info(moduleName):
    Module = Query()
    return ModuleInfo.search(Module["moduleName"]==moduleName)

# 
def DeleteModuleData(moduleName,id):
    moduleInfo = get_module_info(moduleName)[0]
    path = f"{moduleInfo['path']}/{moduleName}.json"
    moduleData = TinyDB(path).table(moduleName)
    files = [field["name"] for field in moduleInfo["fields"] if field["type"]=="file"]
    subModuleData = moduleData.search(Query().fragment({"id":int(id)}))
    if len(subModuleData)>0:
        for subModule in moduleInfo["SubModules"]:
            DeleteModuleData(subModule,id)
    for field in moduleInfo["fields"]:
        if field["type"]=="file" and field["name"] in files:
            os.remove(f"{moduleInfo['path']}/files/{subModuleData[0][field['name']]['fileName']}")
            print(f"{moduleInfo['path']}/files/{subModuleData[0][field['name']]['fileName']} is Deleted")
    moduleData.remove(Query().fragment({"id":int(id)}))
    
    
    

def getDeleteModuleData(moduleName,id):
    try:
        moduleInfo =get_module_info(moduleName)[0]
        primary = [field["name"] for field in moduleInfo["fields"] if field["category"]=="primary"]
        path = f"{moduleInfo['path']}/{moduleName}.json"
        Table = TinyDB(path).table(moduleName)
        data = Table.get(doc_id=int(id))
        if len(moduleInfo["SubModules"])>0:
            for subModule in moduleInfo["SubModules"]:
                DeleteModuleData(subModule,id)
        

        for field in moduleInfo["fields"]:
            
            if field["type"]=="file" and not field["name"] in primary:
                os.remove(f"{moduleInfo['path']}/files/{data[field['name']]['fileName']}")
                print(f"{moduleInfo['path']}/files/{data[field['name']]['fileName']} is Deleted")
        Table.remove(doc_ids=[int(id)])
        return True


    except Exception as e:
        print(e)
        return False
        


def CreateModule(moduleInfo,keys):
    
    if "mainModule"  in keys :
       
        moduleInfo["isSubModule"] = True
        MainModule = TinyDB("./Storage/modules.json").table("ModulesInfo")
        MainModuleInfo = MainModule.search(Query()["moduleName"]==moduleInfo["mainModule"])[0]
        ModuleNames = MainModuleInfo["SubModules"]
        ModuleNames.append(moduleInfo["moduleName"])
        MainModuleInfo["SubModules"] = ModuleNames
        path = f"{MainModuleInfo['path']}/subModules/{moduleInfo['moduleName']}"
        MainModule.update(MainModuleInfo,Query()["moduleName"]==moduleInfo["mainModule"])

    else :
        path = f"./{Storage_Folder}"
        path = f"{path}/{moduleInfo['moduleName']}"
        moduleInfo["isSubModule"] = False
    moduleInfo["SubModules"] = []

    moduleInfo["path"] = path
    ModuleInfo.insert(moduleInfo)
    ModuleNameList.append(moduleInfo["moduleName"])
    os.makedirs(path,exist_ok=True)
    data = TinyDB(f"{path}/{moduleInfo['moduleName']}.json")
    data.table(moduleInfo["moduleName"])

def getDataFromModule(moduleName,id):
    moduleInfo = get_module_info(moduleName)[0]
    Tablemodule = TinyDB(f"{moduleInfo['path']}/{moduleName}.json").table(moduleName)
    records = Tablemodule.get(doc_id=id)
   
        
    if "mainModule" in moduleInfo.keys():
        print(moduleInfo["mainModule"])
        print(moduleInfo["SubModules"])
        id = records["id"]
      
        records.update(getDataFromModule(moduleInfo["mainModule"],id)) 
        records.pop("id")
        
    

  
    return records
        

def getModuleData(module):
    moduleInfo =get_module_info(module)[0]
    path = f"{moduleInfo['path']}/{module}.json"
    data = TinyDB(path)
    Table = data.table(module)
    records = Table.all()
    if moduleInfo["isSubModule"]:
        #MainModule = get_module_info(moduleInfo["mainModule"])[0]
        fields = moduleInfo["MainModuleFieldNames"]        
        #MainData  = TinyDB(f"{MainModule['path']}/{moduleInfo['mainModule']}.json").table(moduleInfo["mainModule"])
        #MainModulerecord = MainData.all()
        #MainModulerecorddict = {record.doc_id:record for record in MainModulerecord}
        data = {}
        dataValues = []
        moduleData  = Table
        print(moduleData)
        # it gathers the data from the all main modules 
        
        for rec in records:
            id = rec["id"]
            print(rec,id)
            record_id = rec.doc_id
            fieldsValues = {}
            recmodule = getDataFromModule(moduleInfo["mainModule"],id)
            
            fieldsValues.update(recmodule)
            fieldsValues.update(rec)
            fieldsValues["rec_id"] = record_id
            fieldsValues["id"] = id
            for field in fields:
                if field not in moduleInfo["MainModuleFieldNames"]:
                    fieldsValues.pop(field)
            #data[record_id] = fieldsValues 
            dataValues.append(fieldsValues)
            

        print(dataValues)
        #print(data.keys())
        #print(data  )
        return dataValues
        '''

        for record in MainModulerecord:
            print(record)
            idwithValues ={}
            for field in fields:
                idwithValues[field]=record[field]
            data[record.doc_id]=idwithValues
        keys = list(data.keys())
        print(keys)
        for (i,record) in enumerate(records):
            record["id"] = record.doc_id
            for value in keys:
                print(value)
                actual = data[value]
                for key in list(actual.keys()):
                    print(key ,actual[key])
                    record[key]=actual[key]

        return records
       
        for record in records:
            MainModulerecord = MainModulerecorddict.get(record["id"])
            record["rec_id"] = record.doc_id
            
            if MainModulerecord:
                for field in fields:
                    record[field] = MainModulerecord.get(field)
        return records
         '''
    for record in records:
        record["id"] = record.doc_id
    return records
 
   

def queryModuleData(module,query):
    moduleInfo =get_module_info(module)[0]
    path =f"{moduleInfo['path']}/{module}.json"
    data = TinyDB(path)
    
    Table = data.table(module)
    if moduleInfo["isSubModule"]:
        #MainModule = get_module_info(module)[0]
        #fields = moduleInfo["MainModuleFieldNames"]        
        data = {}
        senddata = []
        moduleData  = Table
        if "id" in query.keys():
            id = query["id"]
            print(module)
            record = Table.get(doc_id=int(id))
            print("record",record)
            print("query",query)
            id = record.doc_id
            print("id",id)
            record = getDataFromModule(module,id)
            record["rec_id"] = record.doc_id
            record["id"] = query["id"]
            
            return record
        for record in moduleData:
            id = record["id"]
            record["rec_id"] = record.doc_id
            fieldsValues = {}
            recmodule = getDataFromModule(module,id)
            fieldsValues.update(recmodule)
            fieldsValues.update(record)
    
            senddata.append(fieldsValues)
            
            print("query",query)
            print(recmodule)
            for field in query.keys():
                    result = re.search(rf'^{query[field]}',recmodule[field].lower(),flags=re.IGNORECASE)
                    result = query[field].lower() in recmodule[field].lower()
                    if result == False: 
                        senddata.remove(fieldsValues)
                   
        return senddata
            
        '''
        MainData  = TinyDB(f"{MainModule['path']}/{moduleInfo['mainModule']}.json").table(moduleInfo["mainModule"])
        MainModulerecord = MainData.all()
        moduleData  = Table.all()
        MainModulerecorddict = {record.doc_id:record for record in MainModulerecord}
        print(moduleInfo["MainModuleFieldNames"])
        a = [field in query.keys() for field in moduleInfo["MainModuleFieldNames"]]
        print(a)
        if MainModule["isSubModule"]:
            print("MainModule",MainModule)
            MainModule = get_module_info(MainModule["mainModule"])[0]
            MainData  = TinyDB(f"{MainModule['path']}/{MainModule['moduleName']}.json").table(MainModule['moduleName'])
        
          


        if True in a:
            print("query",query)
            data = {}           
            for field in query.keys():
                if field in moduleInfo["MainModuleFieldNames"]:
                    data[field] = query[field]
            print(data)
            MainModulerecords = MainData.search(Query().fragment(data))
            for record in MainModulerecords:
                id = record.doc_id
                
                rec = Table.get(Query().fragment({"id":id}))
                record["rec_id"] = rec.doc_id
                record.update(rec)
                for field in query.keys():
                    if field not in moduleInfo["MainModuleFieldNames"]:
                        if rec[field] != query[field]:
                            MainModulerecords.remove(record) 

            return MainModulerecords
            

        
       
        for record in moduleData:
            send = False   
            MainModulerecord = MainModulerecorddict.get(record.doc_id)
            record["rec_id"] = record.doc_id
            print(record)
            if query == {}:
                return moduleData
            if MainModulerecord:
                for field in fields:
                    record[field] = MainModulerecord.get(field)
                for  key in list(query.keys()):
                     if query[key] == record[key]:
                         send = True
                if send:
                    record
                senddata.append(record)
            if "id" in query.keys():
                if record["id"]==query["id"]:
                    return record
           
        return senddata
        
'''
        
        

    if "id" in query.keys():
        record = Table.get(doc_id=int(query["id"]))
        #print("records",record)
        record["id"] = query["id"]
        return record
    
    
    records = Table.search(Query().fragment(query))
    for record in records:
        record["id"] = record.doc_id
    
    #print(records)
    return records

def AddModuleData(moduleName,data):
    moduleInfo = get_module_info(moduleName)[0]
    path =f"{moduleInfo['path']}/{moduleName}.json"

    database = TinyDB(path).table(moduleName)
    database.insert(data)

def ConvertToCsv(moduleName,query={}):
    moduleInfo =get_module_info(moduleName)[0]
    path = f"{moduleInfo['path']}/{moduleName}.json"
    data = TinyDB(path).table(moduleName)
    data = data.all()
    print(data)

    return jsonify({"data":"SubModule"})
 


def is_exist(moduleName):
    Module = Query()
    return db.search(Module["Modules"]["moduleName"]== moduleName)

    

@app.route("/api/createModule/",methods=["POST","GET"])
@cross_origin()
def create_module():
    if request.method == "GET":
        data=request.args.to_dict()
        if data["moduleName"] in  ModuleNameList:
            print("module Exists!")
            return jsonify({"exist":True})
        else:
            return jsonify({"exist":False})

    # To Handle The POST Request
    if request.method =="POST":
        data = request.get_json()
        keys = data.keys()

        print(data)
        if data["moduleName"] not in ModuleNameList:
            CreateModule(data,keys)
            return jsonify({"data":"Module Exists!"})
        
    return jsonify({"data":"ok"})




# Get Module Information Such as Fields, SubModules
@app.route("/api/getModules/",methods=["GET"])
@cross_origin()
def get_modules():
    if request.method == "GET":
        data=request.args.to_dict()
        keys = data.keys()
        if "modulelist" in keys:
            return jsonify({"Modules":ModuleNameList})
        
    return jsonify({"data":"ok"})






# Get specific Modules Data 
@app.route("/api/getModule/",methods=["GET","POST"])
@cross_origin()
def get_module():
    # GET method to get the module data
    if request.method == "GET":
        data = request.args.to_dict()
        keys = data.keys()
        if "moduleName" in keys: 
            return jsonify(get_module_info(data["moduleName"])[0])
        return jsonify({"data":"ok"})

    # POST method to add data to the module
    if request.method == "POST":
        data = request.form.to_dict()
        files = request.files.to_dict()
        params = request.args.to_dict()

        moduleInfo = get_module_info(params["moduleName"])[0]
        path = moduleInfo["path"]
        if moduleInfo["isSubModule"]:
           array = []   
           print(data)
           print(files)
           path= moduleInfo["path"]
           formData = {}
           if len(files)>0:
               os.makedirs(path,exist_ok=True)
               for key in files.keys():
                    file = files[key]
                    print(files[key].content_type)
                    print(file.filename)
                    file.filename = file.filename.split("_")[-1]
                    id = file.filename.split("_")[0]
                    print(id)
                    fileName = f'{secure_filename(file.filename)}'
                    data[key] = {"fileName":fileName}
                    file.save(f"{path}/{fileName}")
           formData.update(data) 
           print(formData)
           ids = {int(key.split("_")[0]) for key in formData.keys()}
           print(ids)
           for id in ids:
               form = {}
               form["id"] = id
               for key in formData.keys():
                   if key.startswith(f"{id}_"):
                       form[key.split("_")[-1]] = formData[key]
               AddModuleData(params["moduleName"],form)
                        
        else:
            formData = {}
            
            path= f"{path}/files"
            if len(files)>0:
                os.makedirs(path,exist_ok=True)
                for key in files.keys():
                    file = files[key]
                    print(files[key].content_type)
                    fileName = f'{secure_filename(file.filename)}'
                    formData[key] = {"fileName":fileName}
                    file.save(f"{path}/{fileName}")
            formData.update(data)
        
        
            AddModuleData(params["moduleName"],formData)                    
            return jsonify({"data":"added"})
            
        
        
    return jsonify({"data":"ok"})


@app.route("/api/UpdateSubModuleData/",methods=["POST","GET"])
@cross_origin()
def get_sub_module_data():
    if request.method == "GET":
        data = request.args.to_dict()
        keys = data.keys()
        moduleInfo = get_module_info(data["moduleName"])[0]
        MainModuleInfo = get_module_info(moduleInfo["mainModule"])[0]
        print(getModuleData(data["moduleName"]))
        if "moduleName" in keys:
            print(moduleInfo["mainModule"])
            moduleData = TinyDB(f"{moduleInfo['path']}/{moduleInfo['moduleName']}.json").table(moduleInfo["moduleName"])
            mainModuleData = TinyDB(f"{MainModuleInfo['path']}/{moduleInfo['mainModule']}.json").table(moduleInfo['mainModule'])
            fields = [field["name"] for field in moduleInfo["fields"] if field["name"] not in moduleInfo["MainModuleFieldNames"]   ]
            fieldName = {field["name"]:field for field in moduleInfo["fields"] if field["module"]==moduleInfo["moduleName"]}
            #print(fieldName)
            moduleDatas = []
            moduleFields = [field["name"] for field in moduleInfo["fields"] if field["module"]==moduleInfo["moduleName"]]
            print(moduleFields)

            for record in mainModuleData:
                id = record.doc_id
                data = moduleData.search(Query().fragment({"id":id}))
                print(data)
                if len(data)>0:
                    data = data[0]
                    keys = data.keys()
                    for field in fields:
                        if field in keys :
                            

                            fieldData = deepcopy(fieldName[field])
                            fieldData["value"] = data[field]

                            record[field]= fieldData
                else:
                    for field in fields:
                        fieldData = deepcopy(fieldName[field])
                        fieldData["value"] = ""
                        record[field] = fieldData
                       
                
                record["id"] = id            
                moduleDatas.append(record)
                
                print(record)


            print(moduleDatas)
         

                
            fields= moduleInfo["MainModuleFieldNames"]+fields


            return jsonify({"data":moduleDatas,"moduleInfo":moduleInfo,"fields":fields})
        return jsonify({"data":"ok"})

    if request.method == "POST":
       data = request.form.to_dict()
       files = request.files.to_dict()
       params = request.args.to_dict()
       print(data)
       print(files)
       print(params)
       moduleInfo = get_module_info(params["moduleName"])[0]
       path = moduleInfo["path"]
       Table = TinyDB(f"{path}/{moduleInfo['moduleName']}.json").table(moduleInfo["moduleName"])
       if(len(files)>0):
           os.makedirs(f"{path}/files",exist_ok=True)
           for key in files.keys():
               file = files[key]
               fileName = f'{secure_filename(file.filename)}'
              
               data[key] = {"fileName":fileName}
               file.save(f"{path}/files/{fileName}")

        

       for key in data.keys():
            if "_" in key :
                id = key.split("_")[0]
                field = key.split("_")[-1]
                record = Table.search(Query().fragment({"id":int(id)}))
                if len(record)>0:
                    record = record[0]
                    Table.update(data[field],Query().fragment({"id":int(id)}))
                else:
                    Table.insert({"id":int(id),field:data[key]})
            

       return jsonify({"data":"ok"})

@app.route("/api/getModuleData/",methods=["GET"])
@cross_origin()
def get_module_data():
    if request.method == "GET":                                                                                                                                     
        data = request.args.to_dict()
        keys = data.keys()
        print(data)

        moduleInfo = get_module_info(data["moduleName"])[0]
        if "mainModule" in moduleInfo.keys():
            MainModule = get_module_info(moduleInfo["mainModule"])[0]
            print(MainModule["path"])
            subModuleTable = TinyDB(f"{MainModule['path']}/{moduleInfo['mainModule']}.json").table(moduleInfo["mainModule"])

        if "moduleName" in keys:
        
            if "fields" in keys and "filter" in keys:

                list_fields = [field["name"]  for field in moduleInfo["fields"] ]
                fields = moduleInfo["fields"]
                try:    
                    filters = json.loads(data["filter"])
                except:
                    filters = json.loads(data["filter"])
                filters = {key:filters[key] for key in filters if filters[key]!=""}

              
                query = queryModuleData(data["moduleName"],filters)
                print(query)

                for field in fields:
                    print(  query)
                    id = query["id"]
                    print(id,query)
                    if "subModule" not in field.keys():
                        field["value"] = query[field["name"]] 
                        field["id"] = query["id"] 
                    else:
                        print(id)
                        print(subModuleTable.get(doc_id=id))
               
                return jsonify({"moduleData":fields,"moduleInfo":moduleInfo})
            
            
            list_fields  = [field["name"]  for field in moduleInfo["fields"] if field["isDisplay"]=="Yes"]

            if "filter" in keys and data["filter"]!="":
                try:
                    filters = json.loads(data["filter"])
                except:
                    filters = json.loads(data["filter"])
                filters = {key:filters[key] for key in filters if filters[key]!=""}
           
               # print("query",queryModuleData(data["moduleName"],filters))
                data = {
                    "moduleName":data["moduleName"],
                    "Fields":list_fields,
                    "data":queryModuleData(data["moduleName"],filters),
                    "moduleInfo":moduleInfo
                }
            else:   
               # print("query",getModuleData(data["moduleName"]))
                data = {
                    "moduleName":data["moduleName"],
                    "Fields":list_fields,
                    "data":getModuleData(data["moduleName"]),
                    "moduleInfo":moduleInfo
                }
             
            return jsonify(data)
        

            
       
    return jsonify({"data":"ok"})

# pending 
@app.route("/api/getModuleDataCsv/",methods=["GET"])
@cross_origin()
def get_module_data_csv():
    if request.method == "GET":
        data = request.args.to_dict()
        keys = data.keys()
        if "moduleName" in keys:
            ConvertToCsv(data["moduleName"])
            return jsonify({"data":"ok"})
    return jsonify({"data":"ok"})


# Update Specific  Module  Data
@app.route("/api/updateModuleData/",methods=["PUT"])
@cross_origin()
def update_module():
    if request.method == "PUT":
        data = request.form.to_dict()
        files = request.files.to_dict()
        formData ={}
        # module info        
        id = data["id"]
        moduleName = data["moduleName"]
        data.pop("id")
        data.pop("moduleName")
        moduleInfo = get_module_info(moduleName)[0]
        path = moduleInfo["path"]
        print(path)

        if len(files)>0:
            file_path = f"./{path}/files"
            os.makedirs(file_path,exist_ok=True)
            for key in files.keys():
                file = files[key]
                fileName = f'{secure_filename(file.filename)}'
                quered = queryModuleData(moduleName,{"id":id})
                if key in quered.keys():
                    os.remove(f"{file_path}/{quered[key]['fileName']}")
                    print(f"{quered[key]['fileName']} is Deleted")
                formData[key] = {"fileName":fileName}
                file.save(f"{file_path}/{fileName}")

        
        formData.update(data)
        print(formData)
        print(queryModuleData(moduleName,{"id":id}))
        # updating the table data
        path = f"./{path}/{moduleName}.json"
        database = TinyDB(path).table(moduleName)
        database.update(formData,doc_ids=[int(id)])
        return jsonify({"data":"ok"})
    
    return jsonify({"data":"ok"})




# Delete Specific Module
@app.route("/api/deleteModuleData/",methods=["GET"])
@cross_origin()
def delete_module():
    if request.method == "GET":
        data = request.data.decode("utf-8")
        param = request.args.to_dict()
        print(param)
       
        ModuleName = param["moduleName"]
        doc_id = param["id"]
        print(ModuleName,doc_id)
        if getDeleteModuleData(ModuleName,doc_id):
            return jsonify({"data":"ok"})
        else:
            return jsonify({"data":"Try again"})
    return jsonify({"data":"ok"})
    
'''
@app.route("/api/deleteModule/",methods=["DELETE"])
@cross_origin()
def DeleteModule():
    if request.method =="DELETE":
        data = request.data.decode("utf-8")
        try:
            data =json.loads(data)
        except:
            data = json.loads(data)
        moduleName = data["moduleName"] 
        moduleInfo = get_module_info(moduleName=moduleName)[0]
        if "mainModule" not in moduleInfo.keys():
            path = f"{moduleInfo['path']}/"
            
            ModuleInfo.remove(Query()["moduleName"]==moduleName)
            print(f"{moduleName} is Deleted!")
           
        else:
            path = f"{moduleInfo['path']}/subModules/{moduleName}/"
            os.rmdir(path)
            print(path)
            ModuleInfo.remove(Query()["moduleName"]==moduleName)
            print(f"{moduleName} is Deleted!")
        
        return jsonify({"data":f"{moduleName} is Deleted!"})
     

    return jsonify({"data":"ok"})

'''

        

@app.route("/api/getFile/",methods=["GET"])
@cross_origin()
def get_file():
    if request.method == "GET":
        data = request.args.to_dict()
        files = request.files.to_dict()
        keys = data.keys()
        
        if "moduleName" in keys:
            if "fileName" in keys:
                moduleInfo = get_module_info(data["moduleName"])[0]
                path = f"{moduleInfo['path']}/files".replace("./","")
                print("files",files)
                print("path",path)
                try:
                    return send_file(f"{path}/{data['fileName']}")
                except Exception as e:
                    print(e)
                    return jsonify({"data":"error"})
               

    return jsonify({"data":"ok"}) 


if __name__ =="__main__":
    app.run(debug=True ,host="0.0.0.0")




