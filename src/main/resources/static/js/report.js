let reportBills ={};

reportBills.showDatatable=function (){
    $('#report-order').empty().append(
        `<h1 className="h3 mb-2 text-gray-800">Báo cáo nhập sản phẩm</h1>
         <p className="mb-4"></p>
         <div class="card shadow mb-4">
                    <div class="card-header py-3">
                        <h6 class="m-0 font-weight-bold text-primary text-uppercase">Báo cáo nhập sản phẩm</h6>
                    </div>
                    <div class="card-body">
                        <div class="row">
                            <div class="col-sm-3">
                                <div class="form-group">
                                    <div class="input-group date" id="datetimepicker1" data-target-input="nearest">
                                        <label class="col-form-label mr-2">Từ ngày</label>
                                        <input type="text" id="test-time1" class="form-control datetimepicker-input"
                                               data-target="#datetimepicker1"/>
                                        <div class="input-group-append" data-target="#datetimepicker1"
                                             data-toggle="datetimepicker">
                                            <div class="input-group-text"><i class="fa fa-calendar"></i></div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div class="col-sm-3">
                                <div class="form-group">
                                    <div class="input-group date" id="datetimepicker2" data-target-input="nearest">
                                        <label class="col-form-label mr-2">Đến ngày</label>
                                        <input type="text" id="test-time2" class="form-control datetimepicker-input"
                                               data-target="#datetimepicker2"/>
                                        <div class="input-group-append" data-target="#datetimepicker2"
                                             data-toggle="datetimepicker">
                                            <div class="input-group-text"><i class="fa fa-calendar"></i></div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div class="col-sm-3">
                                <a href="#" class="btn btn-light btn-icon-split border">
                                    <span class="icon text-gray-600 bg-light">
                                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24"
                                             viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"
                                             stroke-linecap="round" stroke-linejoin="round"><path
                                                d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path><polyline
                                                points="22 4 12 14.01 9 11.01"></polyline></svg>
                                    </span>
                                    <span class="text" onclick="reportBills.showBills()">Áp dụng</span>
                                </a>
                            </div>
                        </div>
                    </div>
                    <div class="card-body bd-t">
                        <div class="table-responsive">
                            <table class="table table-bordered" id="dateTableBills" width="100%" cellspacing="0">
                                <thead>
                                <tr>
                                    <th>Hóa Đơn</th>
                                    <th>Ngày thanh toán</th>
                                    <th>Bàn thanh toán</th>
                                    <th>Tổng giá</th>
                                    <th></th>
                                </tr>
                                </thead>
                                <tfoot>
                                <tr>
                                    <th>Hóa Đơn</th>
                                    <th>Ngày thanh toán</th>
                                    <th>Bàn thanh toán</th>
                                    <th>Tổng giá</th>
                                    <th></th>
                                </tr>
                                </tfoot>
                                <tbody id="list-bill">
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>`
    )
};

reportBills.showBills=function (){
    let dateObj={};
    dateObj.dateIn=document.getElementById("test-time1").value;
    dateObj.dateOut=document.getElementById("test-time2").value;
    console.log(dateObj);
    $.ajax({
        url:"http://localhost:8080/api/bills/dateExport",
        method:"POST",
        dataType:"JSON",
        contentType: "application/json",
        data: JSON.stringify(dateObj),
        success:function (data){
            console.log(data);
            $('#list-bill').empty();
            $.each(data,function (i,v){
                $('#list-bill').append(
                    `<tr>
                        <td>${v.idOrder}</td>
                        <td>${v.dateExport}</td>
                        <td>Bàn ${v.nameTable}</td>
                        <td>${v.totalPrice}</td>
                        <a class='mr-2' href='javascript:;' title='Thông tin chi tiết' onclick='reportBills.showBillDetails(${v.idOrder})' ><i class='fas fa-eye'></i></a>
                    </tr>`
                )
            })
        }
    })
};

reportBills.showBillDetails=function (){

};

$(document).ready(function () {
    reportBills.showDatatable();
}
);
