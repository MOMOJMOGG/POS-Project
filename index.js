// ======= default data =======
const menu = document.querySelector("#menu");
const cart = document.querySelector("#cart");
const totalAmount = document.querySelector("#total-amount");
const button = document.querySelector("#submit-button");

// 菜單資料
let productData = [
  {
    id: "product-1",
    imgUrl:
      "https://images.unsplash.com/photo-1558024920-b41e1887dc32?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=500&q=60",
    name: "馬卡龍",
    price: 90
  },
  {
    id: "product-2",
    imgUrl:
      "https://images.unsplash.com/photo-1560691023-ca1f295a5173?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=500&q=60",
    name: "草莓",
    price: 60
  },
  {
    id: "product-3",
    imgUrl:
      "https://images.unsplash.com/photo-1568271675068-f76a83a1e2d6?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=500&q=60",
    name: "奶茶",
    price: 100
  },
  {
    id: "product-4",
    imgUrl:
      "https://images.unsplash.com/photo-1514517604298-cf80e0fb7f1e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=500&q=60",
    name: "冰咖啡",
    price: 180
  }
];
// ======= 請從這裡開始 =======
// 1. 顯示所有的品項名稱、價格和照片
function displayProduct() {
  let contentHTML = ``

  productData.forEach((product) => {
    contentHTML += `
                  <div class="col-3">
                    <div class="card">
                      <img src="${product.imgUrl}" class="card-img-top" alt="...">
                      <div class="card-body">
                        <h5 class="card-title">${product.name}</h5>
                        <p class="card-text">${product.price}</p>
                        <a href="#" class="btn btn-primary">加入購物車</a>
                      </div>
                    </div>
                  </div>
                `
  })

  menu.innerHTML = contentHTML
}

// 2. 購物車清單 與 事件處理
menu.addEventListener('click', function onAddToCart(event) {
  const target = event.target
  if (target.tagName === "A") {
    const price = target.previousElementSibling
    const product = price.previousElementSibling

    const order = { product: product.innerText, price: price.innerText, amount: 1 }

    // 更新購物車清單
    updateCartList(order)
  }
})

function updateCartList(newOrder) {
  function cartOrderMatched(order) {
    return order.product === newOrder.product
  }

  // 取得 LocalStorage 資料
  const cartList = JSON.parse(localStorage.getItem('cartList')) || []

  // 確認新點單是否存在購物車中
  if (cartList.some(cartOrderMatched)) {
    const targetObj = cartList.find(cartOrderMatched)
    targetObj.amount += 1
  } else {
    cartList.push(newOrder)
  }

  // 更新 localStorage
  localStorage.setItem('cartList', JSON.stringify(cartList))

  // 刷新顯示購物車清單
  renderCart(cartList)
}

function renderCart(cartList) {
  let contentHTML = ``
  let totalCost = 0

  cartList.forEach((order) => {
    const totalPrice = order.price * order.amount
    totalCost += totalPrice

    contentHTML += `
        <li class="list-group-item">${order.product} X ${order.amount} 小計：${totalPrice}</li>
    `
  })

  cart.innerHTML = contentHTML

  // 3. 更新總金額
  totalAmount.innerText = totalCost
}

// modal element
const modalBody = document.querySelector('.modal-body')

// 4. 送出訂單 跳出收據
button.addEventListener('click', function sendOrder(event) {
  /// 確認 是否有點餐
  const cartList = JSON.parse(localStorage.getItem('cartList')) || []

  if (cartList.length === 0) {
    emptyOrderNotify()
  } else {
    listSendOrder()
  }
})

function listSendOrder() {
  const modalTitle = modalBody.previousElementSibling.firstElementChild
  modalTitle.innerText = "AC咖啡 感謝您的購買 (*≧▽≦)"

  const modalCheckBtn = modalBody.nextElementSibling.firstElementChild
  modalCheckBtn.innerText = "結帳"

  const listGroupItems = cart.children
  const itemsCount = cart.children.length
  let newNode = null

  const ul = elementCreator("ul")
  ul.style = "list-style-type:none"

  for (let i = 0; i < itemsCount; i++) {
    newNode = elementCreator("li", listGroupItems[i].innerText)
    ul.appendChild(newNode)
  }

  newNode = elementCreator("li", totalAmount.parentElement.innerText)
  ul.appendChild(newNode)

  modalBody.appendChild(ul)
}

function emptyOrderNotify() {
  const modalTitle = modalBody.previousElementSibling.firstElementChild
  modalTitle.innerText = "AC咖啡 客人, 您還沒點餐呢! ╮(╯▽╰)╭"

  const modalCheckBtn = modalBody.nextElementSibling.firstElementChild
  modalCheckBtn.innerText = "繼續點餐"
}

function elementCreator(tag, text = "") {
  const tagElement = document.createElement(tag)
  tagElement.innerText = text
  return tagElement
}

function clearCart() {
  cart.innerHTML = ``
  totalAmount.innerText = '--'
  localStorage.removeItem('cartList')
  modalBody.innerHTML = ``
}

// 5. 確認收據, 購物車被清空
// bootstrap 4 modal event
$('#post-modal').on('hidden.bs.modal', (event) => {
  // 清空 購物車清單 與 總金額 與 localStorage 暫存檔
  clearCart()
})

$('#send-order-check').on('click', (event) => {
  // 清空 購物車清單 與 總金額 與 localStorage 暫存檔
  clearCart()

  // 關閉 跳出視窗
  $('#post-modal').modal('hide')
})

// 頁面初始化
function initial() {
  displayProduct()
  clearCart()
}

initial()