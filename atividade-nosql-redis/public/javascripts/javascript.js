/* eslint-disable no-implied-eval */
/* eslint-disable no-unused-vars */
let vObj
let vFun

function mascara (o, f) {
  vObj = o
  vFun = f

  setTimeout('execmascara()', 1)
}

function execmascara () {
  vObj.value = vFun(vObj.value)
}

function moeda (v) {
  v = v.replace(/\D/g, '') // permite digitar apenas numero
  v = v.replace(/(\d{1})(\d{17})$/, '$1.$2') // coloca ponto antes dos ultimos digitos
  v = v.replace(/(\d{1})(\d{13})$/, '$1.$2') // coloca ponto antes dos ultimos 13 digitos
  v = v.replace(/(\d{1})(\d{10})$/, '$1.$2') // coloca ponto antes dos ultimos 10 digitos
  v = v.replace(/(\d{1})(\d{7})$/, '$1.$2') // coloca ponto antes dos ultimos 7 digitos
  v = v.replace(/(\d{1})(\d{1,2})$/, '$1,$2') // coloca virgula antes dos ultimos 2 digitos

  return v
}
