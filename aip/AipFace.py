from aip import AipFace
import base64
import cv2
from PIL import Image

cap = cv2.VideoCapture(0)
while(1):
    # get a frame
    ret, frame = cap.read()
    # show a frame
    cv2.imshow("capture", frame)
    if cv2.waitKey(1) & 0xFF == ord('p'):
        cv2.imwrite("/home/duansq/duan/duan.jpg", frame)
        break
cap.release()
cv2.destroyAllWindows()

""" 你的 APPID AK SK """
APP_ID = '15257657'
API_KEY = 'G9yWRpQRxqGLl0vZv2MIqoNE'
SECRET_KEY = 'RLol5YGP3EUIEgmQskKLScYvUm3cySvx'
client = AipFace(APP_ID, API_KEY, SECRET_KEY)

url_pic = '/home/duansq/duan/duan.jpg'
f = open(url_pic, 'rb')
image = str(base64.b64encode(f.read()), 'utf-8')
imageType = "BASE64"
groupIdList = "2014,2015,2016,2017,2018"

""" 调用人脸搜索 """

a = client.search(image, imageType, groupIdList)
user_id = a['result']['user_list'][0]['user_id']
user_info = a['result']['user_list'][0]['user_info']
score = a['result']['user_list'][0]['score']
print(user_id, user_info, score)

gender = user_info.split()[0]
beauty = float(user_info.split()[1])

if beauty < 70 and gender == 'male':
    duan = '/home/duansq/duan/' + user_id[0:4] + '/Normal_Male/' + user_id + '.jpg'
    im = Image.open(duan)
    im.show()
elif beauty < 70 and gender == 'female':
    duan = '/home/duansq/duan/' + user_id[0:4] + '/Normal_Female/' + user_id + '.jpg'
    im = Image.open(duan)
    im.show()
elif beauty >= 70 and gender == 'male':
    duan = '/home/duansq/duan/' + user_id[0:4] + '/Good_Male/' + user_id + '.jpg'
    im = Image.open(duan)
    im.show()
elif beauty >= 70 and gender == 'female':
    duan = '/home/duansq/duan/' + user_id[0:4] + '/Good_Female/' + user_id + '.jpg'
    im = Image.open(duan)
    im.show()
else:
    print('Not Found!')

