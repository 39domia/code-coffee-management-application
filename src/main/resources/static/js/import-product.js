let importProducts = {};
let product = {};

importProducts.initImportProductTable = function () {
    $("#importProducts-datatables").DataTable({
        ajax: {
            url: `${apiUrl}/importProducts/`,
            method: "GET",
            dataType: "json",
            dataSrc: ""
        },
        columns: [
            {data: "product.name", name: "product.name", title: "Tên sản phẩm", orderable: true},
            {data: "dateJoin", name: "dateJoin", title: "Ngày nhập"},
            {data: "quantity", name: "quantity", title: "Số lượng"},
            {
                data: "price", name: "price", title: "Giá",
                "render": function (data, type, row) {
                    return `<span class="dttbl-price">${formatPrice(data)}</span>`;
                }
            },
            {data: "totalPrice", name: "totalPrice", title: "Tổng giá",
                "render": function (data, type, row) {
                    return `<span class="dttbl-price">${formatPrice(data)}</span>`;
                }
            },
            {data: "comment", name: "comment", title: "ghi chú"},
            {
                data: "id", name: "action", title: "Chức năng", orderable: false,
                "render": function (data, type, row, meta) {
                    return "<a href='javascript:;' title='edit product' onclick='importProducts.get(" + data + ")'><i class='fa fa-edit'></i></a> " +
                        "<a href='javascript:;' title='remove product' onclick='importProducts.delete(" + data + ")' ><i class='fa fa-trash'></i></a>"
                }
            },
        ],
        order: [[1, "desc"]],
        language: {
            "sProcessing": "Đang xử lý...",
            "sLengthMenu": "Xem _MENU_ mục",
            "sZeroRecords": "Không tìm thấy dòng nào phù hợp",
            "sInfo": "Đang xem _START_ đến _END_ trong tổng số _TOTAL_ mục",
            "sInfoEmpty": "Đang xem 0 đến 0 trong tổng số 0 mục",
            "sInfoFiltered": "(được lọc từ _MAX_ mục)",
            "sSearch": "Tìm kiếm:",
            "oPaginate": {
                "sFirst": "Đầu",
                "sPrevious": "Trước",
                "sNext": "Tiếp",
                "sLast": "Cuối"
            }
        }
    });
}

importProducts.addNew = function () {
    $('#modalTitle').html("Nhập sản phẩm");
    importProducts.resetForm();
    $('#modalAddEditIP').modal('show');
}

importProducts.resetForm = function () {
    $('#formAddEdit')[0].reset();
    $('#product.name').val('');
    $('#err-price-import-product').html('');
    $('#err-quantity-import-product').html('');
    $('#quantity').val('');
    $('#price').val('');
    $('#totalPrice').val('');
    $('#comment').val('');
}

importProducts.get = function (id) {
    // console.log('get :' + id);
    $.ajax({
        url: `${apiUrl}/importProducts/${id}`,
        method: "GET",
        dataType: "json",
        success: function (data) {
            // console.log(data);
            $('#formAddEdit')[0].reset();
            $('#modalTitle').html("Cập nhật");
            $('#productName').val(data.product.id);
            $('#old-quantity').val(data.quantity);
            $('#quantity').val(data.quantity);
            $('#price').val(data.price);
            $('#comment').val(data.comment);
            $('#id').val(data.id);
            $("#products option:selected").html(data.product.name);
            $("#products").val(data.product.id);
            $('#modalAddEditIP').modal('show');

        }
    });
};

importProducts.initProduct = function (data) {
    $.ajax({
        url: `${apiUrl}/products/notIngredient`,
        method: "GET",
        dataType: "json",
        success: function (data) {
            $('#products').empty();
            $.each(data, function (i, v) {
                $('#products').append(
                    "<option value='" + v.id + "'>" + v.name + "</option>"
                );
            })
        }
    })
}

importProducts.save = function () {
    // console.log(Number($("#products option:selected").html()));
    if ($('#formAddEdit')) {
        if (!$('#id').val()) {
            $.ajax({
                url: `${apiUrl}/products/${Number($("#products").val())}`,
                method: "GET",
                dataType: "json",
                success: function (data) {
                    let importProductObj = {};
                    importProductObj.quantity = Number($('#quantity').val());
                    importProductObj.price = Number($('#price').val());
                    importProductObj.totalPrice = importProductObj.quantity * importProductObj.price;
                    importProductObj.comment = $('#comment').val();

                    let productObj = data;
                    productObj.inventory += Number(importProductObj.quantity);
                    productObj.productStatus = products.setProductStatus(productObj.inventory, productObj);
                    importProductObj.product = productObj;

                    $.ajax({
                        url: `${apiUrl}/importProducts/`,
                        method: "POST",
                        dataType: "json",
                        contentType: "application/json",
                        data: JSON.stringify(importProductObj),
                        success: function () {
                            products.updateProduct(productObj, productObj.id);
                            toastr.success("Nhập sản phẩm thành công");
                            $('#modalAddEditIP').modal('hide');
                            $("#importProducts-datatables").DataTable().ajax.reload();

                        },
                        error: function (data) {
                            $('#err-quantity-import-product').html(data.responseJSON.quantity);
                            $('#err-price-import-product').html(data.responseJSON.quantity);
                        }
                    });
                }
            });

        } else {
            $.ajax({
                url: `${apiUrl}/products/${Number($("#products").val())}`,
                method: "GET",
                dataType: "json",
                success: function (data) {
                    let importProductObj = {};
                    importProductObj.quantity = Number($('#quantity').val());
                    importProductObj.price = Number($('#price').val());
                    importProductObj.totalPrice = importProductObj.quantity * importProductObj.price;
                    importProductObj.comment = $('#comment').val();
                    importProductObj.id = Number($('#id').val());

                    let productObj = data;
                    let oldInventory = Number($('#old-quantity').val());
                    productObj.inventory -= oldInventory;
                    productObj.inventory += Number(importProductObj.quantity);
                    productObj.productStatus = products.setProductStatus(productObj.inventory, productObj);
                    importProductObj.product = productObj;

                    $.ajax({
                        url: `${apiUrl}/importProducts/${importProductObj.id}`,
                        method: "PUT",
                        dataType: "json",
                        contentType: "application/json",
                        data: JSON.stringify(importProductObj),
                        success: function () {
                            products.updateProduct(productObj, productObj.id);
                            toastr.success(`Cập nhật "nhập sản phẩm" thành công`);
                            $('#modalAddEditIP').modal('hide');
                            $("#importProducts-datatables").DataTable().ajax.reload();
                        },
                        error: function () {
                            console.log("Toang create import product ");
                        }
                    });
                }
            });
        }
    }
}

function deleteImportProduct(id) {
    $.ajax({
        url: `${apiUrl}/importProducts/${id}`,
        method: "DELETE",
        dataType: "json",
        success: function (data) {
            console.log(data);
            toastr.success(`Xóa "nhập sản phẩm" thành công`);
            $('#modalAddEditIP').modal('hide');
            $("#importProducts-datatables").DataTable().ajax.reload();
        }
    })
}

importProducts.delete = function (id) {
    bootbox.confirm({
        title: "Xóa sản phẩm",
        message: "Bạn có muốn xóa đơn nhập hàng này?",
        buttons: {
            cancel: {
                label: '<i class="fa fa-times"></i> No'
            },
            confirm: {
                label: '<i class="fa fa-check"></i> Yes'
            }
        },
        callback: function (result) {
            if (result) {
                $.ajax({
                    url: `${apiUrl}/importProducts/${id}`,
                    method: "GET",
                    dataType: "json",
                    success: function (data) {
                        let productObj = data.product;
                        productObj.inventory -= data.quantity;
                        if (productObj.inventory < 0)
                            productObj.inventory = 0;
                        productObj.productStatus = products.setProductStatus(productObj.inventory, productObj);
                        products.updateProduct(productObj, productObj.id);
                        console.log("update done");
                        deleteImportProduct(id);
                    }
                })
            }
        }
    });
};

importProducts.init = function () {
    importProducts.initImportProductTable();
    importProducts.initProduct();
};

$(document).ready(function () {
    importProducts.init();
});