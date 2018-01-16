/**
 * Created by liuzhuo on 2018/1/15.
 */
class DealImage{
    construct(url){
        this.image_url = url; //缓存待加载图片的地址
        this.minHeight = [0,0,0,0];//用于存放待比较的高度值,可根据需求初始化最小高度
        this.num = 0;//存放加载的次数
        this.len = this.image_url.length;
    }
    /*函数节流（防止滚动条或resize事件触发过快）*/
    Throttle(fn){
        clearTimeout(fn.flag);
        fn.flag = setTimeout(fn,100);
    }
    updateNum(){
        this.num++;
    }
    loadImage(num){
       var img_array = this.image_url;
        /*此处以每次载入20张图片为例，可根据需求自定义*/
        for(var i = num*20;i < (this.len - i*20 <= 20?this.len:(num+1)*20);i++){
            /*以下载入图片*/
            var img_index = this[i];
            var url = img_array[img_index];
            //var min_height = Math.min(...this.minHeight);
            var min_height = Math.min.apply(Math,this.minHeight);
            var min_index = this.minHeight.indexOf(min_height);
            //事先定义好类
            var load_ele = $("ul:eq(min_index) .prepare_load:eq(0)")[0];
            load_ele.classList.remove("prepare_load");//加载后清除待加载标记
            load_ele.src = url;
            /*更新位置数组*/
            this.minHeight[min_index]+=load_ele.offsetHeight;
        }
    }
}
var img_url = ["url1","url2","url3","url4","url5","url6","url7","url8","url9","url10"];
var myDealImage = new DealImage(img_url);//[]中存放需要图片的地址，若地址数目过多可配合ajax瀑布流请求方式
//页面初始化，先加载20张
myDealImage.loadImage(0);
myDealImage.updateNum();
//等待resize 或 scroll事件触发以更新图片
$(document).on("scroll resize",function(){
    //先判断是否满足加载条件（滚动条的高度位置+可见窗口大小超过了高度最低的图片）
    //var min_height = Math.min(...myDealImage.minHeight);
    var min_height = Math.min.apply(Math,this.minHeight);
    var documentEle = document.documentElement;
    if(documentEle.scrollTop+ documentEle.clientHeight >= min_height) {
        myDealImage.Throttle(myDealImage.loadImage(myDealImage.num));
    }
});