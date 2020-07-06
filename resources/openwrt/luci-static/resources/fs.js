(function(window, document, L, rpc, request, baseclass) { 'use strict';'require rpc';'require request';'require baseclass';var callFileList,callFileStat,callFileRead,callFileWrite,callFileRemove,callFileExec,callFileMD5;callFileList=rpc.declare({object:'file',method:'list',params:['path']});callFileStat=rpc.declare({object:'file',method:'stat',params:['path']});callFileRead=rpc.declare({object:'file',method:'read',params:['path']});callFileWrite=rpc.declare({object:'file',method:'write',params:['path','data','mode']});callFileRemove=rpc.declare({object:'file',method:'remove',params:['path']});callFileExec=rpc.declare({object:'file',method:'exec',params:['command','params','env']});callFileMD5=rpc.declare({object:'file',method:'md5',params:['path']});var rpcErrors=[null,'InvalidCommandError','InvalidArgumentError','MethodNotFoundError','NotFoundError','NoDataError','PermissionError','TimeoutError','UnsupportedError'];function handleRpcReply(expect,rc){if(typeof(rc)=='number'&&rc!=0){var e=new Error(rpc.getStatusText(rc));e.name=rpcErrors[rc]||'Error';throw e;}
if(expect){var type=Object.prototype.toString;for(var key in expect){if(rc!=null&&key!='')
rc=rc[key];if(rc==null||type.call(rc)!=type.call(expect[key])){var e=new Error(_('Unexpected reply data format'));e.name='TypeError';throw e;}
break;}}
return rc;}
function handleCgiIoReply(res){if(!res.ok||res.status!=200){var e=new Error(res.statusText);switch(res.status){case 400:e.name='InvalidArgumentError';break;case 403:e.name='PermissionError';break;case 404:e.name='NotFoundError';break;default:e.name='Error';}
throw e;}
switch(this.type){case'blob':return res.blob();case'json':return res.json();default:return res.text();}}
var FileSystem=baseclass.extend({list:function(path){return callFileList(path).then(handleRpcReply.bind(this,{entries:[]}));},stat:function(path){return callFileStat(path).then(handleRpcReply.bind(this,{'':{}}));},read:function(path){return callFileRead(path).then(handleRpcReply.bind(this,{data:''}));},write:function(path,data,mode){data=(data!=null)?String(data):'';mode=(mode!=null)?mode:420;return callFileWrite(path,data,mode).then(handleRpcReply.bind(this,{'':0}));},remove:function(path){return callFileRemove(path).then(handleRpcReply.bind(this,{'':0}));},exec:function(command,params,env){if(!Array.isArray(params))
params=null;if(!L.isObject(env))
env=null;return callFileExec(command,params,env).then(handleRpcReply.bind(this,{'':{}}));},trimmed:function(path){return L.resolveDefault(this.read(path),'').then(function(s){return s.trim();});},lines:function(path){return L.resolveDefault(this.read(path),'').then(function(s){var lines=[];s=s.trim();if(s!=''){var l=s.split(/\n/);for(var i=0;i<l.length;i++)
lines.push(l[i].trim());}
return lines;});},read_direct:function(path,type){var postdata='sessionid=%s&path=%s'.format(encodeURIComponent(L.env.sessionid),encodeURIComponent(path));return request.post(L.env.cgi_base+'/cgi-download',postdata,{headers:{'Content-Type':'application/x-www-form-urlencoded'},responseType:(type=='blob')?'blob':'text'}).then(handleCgiIoReply.bind({type:type}));},exec_direct:function(command,params,type,latin1){var cmdstr=String(command).replace(/\\/g,'\\\\').replace(/(\s)/g,'\\$1');if(Array.isArray(params))
for(var i=0;i<params.length;i++)
cmdstr+=' '+String(params[i]).replace(/\\/g,'\\\\').replace(/(\s)/g,'\\$1');if(latin1)
cmdstr=escape(cmdstr).replace(/\+/g,'%2b');else
cmdstr=encodeURIComponent(cmdstr);var postdata='sessionid=%s&command=%s'.format(encodeURIComponent(L.env.sessionid),cmdstr);return request.post(L.env.cgi_base+'/cgi-exec',postdata,{headers:{'Content-Type':'application/x-www-form-urlencoded'},responseType:(type=='blob')?'blob':'text'}).then(handleCgiIoReply.bind({type:type}));}});return FileSystem; })
