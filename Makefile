image:
	cp build/*.dmg dist/release
	cp build/*.dmg dist/release/eregistry-desktop.dmg
	cp build/*.exe dist/release
	cp build/*.exe dist/release/eregistry-desktop.exe
	cp build/*.yml dist/release
	docker build . -t registry.cn-hangzhou.aliyuncs.com/palan/eregistry-desktop

web:
	docker build . -t registry.cn-hangzhou.aliyuncs.com/palan/eregistry:web -f Dockerfile.web
push: image
	docker push registry.cn-hangzhou.aliyuncs.com/palan/eregistry-desktop
