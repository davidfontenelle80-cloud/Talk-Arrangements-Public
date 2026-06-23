/**
 * toolbar-i18n.js — Stage 4A Batch 4.2 Toolbar i18n polish.
 * Keeps dynamically inserted cloud/account toolbar labels in sync with EN/ES.
 * Text-only patch. No cloud, backup, Firebase, storage, or rollover behavior changes.
 */
(function(){
  'use strict';

  function lang(){return window.state&&state.language==='es'?'es':'en';}
  function es(){return lang()==='es';}
  function txt(en,spa){return es()?spa:en;}
  function setButton(btn,icon,label,title){
    if(!btn)return;
    btn.title=title||label;
    btn.innerHTML=icon+' <span>'+label+'</span>';
  }
  function currentUser(){
    try{return window.KHub&&KHub.CloudAuth&&KHub.CloudAuth.currentUser?KHub.CloudAuth.currentUser():null;}catch(e){return null;}
  }
  function updateToolbarLabels(){
    var accountBtn=document.getElementById('cloudAccountBtn');
    var saveBtn=document.getElementById('cloudSaveBtn');
    var restoreBtn=document.getElementById('cloudRestoreBtn');
    var user=currentUser();

    if(accountBtn){
      if(user)setButton(accountBtn,'&#9989;',user.email||txt('Cloud account','Cuenta en la nube'),txt('Cloud account','Cuenta en la nube'));
      else setButton(accountBtn,'&#128274;',txt('Sign in','Iniciar sesión'),txt('Sign in','Iniciar sesión'));
    }
    setButton(saveBtn,'&#9729;',txt('Cloud Save','Guardar en nube'),txt('Save to cloud','Guardar en nube'));
    setButton(restoreBtn,'&#9729;',txt('Cloud Restore','Restaurar de nube'),txt('Restore from cloud','Restaurar de nube'));

    var settingsSave=document.getElementById('settingsCloudSaveBtn');
    var settingsRestore=document.getElementById('settingsCloudRestoreBtn');
    var settingsExport=document.getElementById('settingsExportBtn');
    var settingsImport=document.getElementById('settingsImportBtn');
    if(settingsSave)settingsSave.innerHTML='&#9729; '+txt('Cloud Save','Guardar en nube');
    if(settingsRestore)settingsRestore.innerHTML='&#9729; '+txt('Cloud Restore','Restaurar de nube');
    if(settingsExport)settingsExport.innerHTML='&#8681; '+txt('Export JSON','Exportar JSON');
    if(settingsImport)settingsImport.innerHTML='&#8679; '+txt('Import file','Importar archivo');
  }

  function scheduleUpdate(){setTimeout(updateToolbarLabels,0);setTimeout(updateToolbarLabels,120);setTimeout(updateToolbarLabels,600);}

  document.addEventListener('click',function(e){
    if(e.target&&e.target.closest&&e.target.closest('[data-lang],#settingsBtn'))scheduleUpdate();
  });
  document.addEventListener('DOMContentLoaded',scheduleUpdate);
  window.addEventListener('load',scheduleUpdate);
  if(window.KHub&&KHub.CloudAuth&&KHub.CloudAuth.onChange){try{KHub.CloudAuth.onChange(scheduleUpdate);}catch(e){}}

  var tries=0;
  (function wait(){
    tries++;
    updateToolbarLabels();
    if(tries<40)setTimeout(wait,250);
  })();
})();
