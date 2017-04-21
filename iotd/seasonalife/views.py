from django.shortcuts import render

# Create your views here.
from django.views.generic import View


class HomePageView(View):
    def get(self, request):
        data_out = {}

        return render(request, 'seasonalife/home.html', data_out)
