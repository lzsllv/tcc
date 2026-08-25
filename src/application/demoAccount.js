const DEMO_LOGO = '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 160 48" role="img" aria-label="Doces da Maria"><rect width="160" height="48" rx="10" fill="#7d3f67"/><text x="80" y="30" text-anchor="middle" font-family="sans-serif" font-size="16" font-weight="700" fill="#fff">Doces da Maria</text></svg>';
const hasEntries = value => Array.isArray(value) ? value.length > 0 : value && typeof value === 'object' ? Object.values(value).some(item => Array.isArray(item) ? item.length > 0 : item !== '' && item !== 0 && item !== null && item !== undefined) : value !== undefined && value !== null && value !== '';
export function isDemoAccountEmpty(account = {}) {
 const workspace=account.workspace ?? account;
 const modern=[workspace.ingredients,workspace.offers,workspace.fixedCosts,workspace.settings];
 if(modern.some(hasEntries)||(workspace.salesChannels??[]).filter(c=>c?.id!=='channel-direct').length>0)return false;
 return !(hasEntries(account.produtos)||hasEntries(account.custosFixos)||hasEntries(account.configuracoes));
}
const ingredient=(id,ownerId,name,category,price,unit,now)=>({id,ownerId,name,category,purchasePriceCents:price,purchaseQuantity:1,purchaseUnit:unit,active:true,createdAt:now,updatedAt:now});
const offer=(id,ownerId,kind,name,category,batchYield,time,sales,components,now)=>({id,ownerId,kind,name,category,active:true,batchYield,batchTimeMinutes:time,expectedMonthlySales:sales,desiredMarginBps:null,components,createdAt:now,updatedAt:now});
export function createDemoAccount(account={},now=new Date().toISOString()){
 if(!isDemoAccountEmpty(account))throw new RangeError('A conta precisa estar vazia para carregar a demonstração.');
 const ownerId=account.ownerId??account.workspace?.ownerId;
 if(typeof ownerId!=='string'||!ownerId.trim())throw new TypeError('Proprietário da conta deve ser informado.');
 const ingredients=[
 ingredient('demo-ingredient-flour',ownerId,'Farinha de trigo','raw-material',520,'kg',now),
 ingredient('demo-ingredient-sugar',ownerId,'Açúcar','raw-material',430,'kg',now),
 ingredient('demo-ingredient-chocolate',ownerId,'Chocolate','raw-material',3200,'kg',now),
 ingredient('demo-ingredient-packaging',ownerId,'Pote e tampa','packaging',85,'un',now)];
 const components=ids=>ids.map((ingredientId,index)=>({id:'demo-component-'+ingredientId,ingredientId,quantity:[0.12,0.08,0.06,1][index],unit:ingredients.find(item=>item.id===ingredientId).purchaseUnit,wasteBps:0}));
 const offers=[
 offer('demo-offer-bolo',ownerId,'product','Bolo no pote','Alimento',12,90,120,components(['demo-ingredient-flour','demo-ingredient-sugar','demo-ingredient-packaging']),now),
 offer('demo-offer-brownie',ownerId,'product','Brownie recheado','Alimento',10,60,180,components(['demo-ingredient-flour','demo-ingredient-sugar','demo-ingredient-chocolate','demo-ingredient-packaging']),now),
 offer('demo-offer-consultoria',ownerId,'service','Consultoria para pequenos negócios','Serviço',1,60,12,[],now)];
 const salesChannels=[
 {id:'demo-channel-direct',ownerId,name:'Venda direta',active:true,isDefault:true,fees:[],createdAt:now,updatedAt:now},
 {id:'demo-channel-instagram',ownerId,name:'Instagram',active:true,isDefault:false,fees:[{id:'demo-fee-instagram',name:'Taxa de pagamento',kind:'percentage',category:'payment',value:300}],createdAt:now,updatedAt:now},
 {id:'demo-channel-delivery',ownerId,name:'Delivery',active:true,isDefault:false,fees:[{id:'demo-fee-delivery',name:'Taxa da plataforma',kind:'percentage',category:'marketplace',value:1200}],createdAt:now,updatedAt:now}];
 return {schemaVersion:2,ownerId,ingredients,offers,salesChannels,fixedCosts:{aluguel:65000,energia:18000,internet:9000,salarios:0,outros:7500,extras:[{id:'demo-extra-packaging',name:'Embalagens e descartáveis',valueCents:12000},{id:'demo-extra-gas',name:'Gás de cozinha',valueCents:8500}]},settings:{businessName:'Doces da Maria — DEMO',logo:DEMO_LOGO,region:'Tupã - SP',laborHourCents:2000,defaultMarginBps:3500,selectedSalesChannelId:'demo-channel-direct'},updatedAt:now};
}
