<template>
  <div>
    <div v-if="users.length > 1">
      <Panel header="Leyenda">
        <div v-for="(_user, indexUser) of this.users" :key="`user-${indexUser}`">
          <b>{{_user.name}}</b> <span class="inline-block">
            <div  class="square" :style="`background: ${_user.color}`"> </div>
          </span>
        </div>
      </Panel>
    </div>
    <br>
    <FullCalendar :options="calendarOptions" />
  </div>
  <div>
    <Dialog :header="modalTitle" :visible.sync="displayBasic"
              :style="{width: '50vw'}" :modal="true">
      <div>
        <div v-for="(work_hour, indexWorkHour) of getHours(selectedDate)" :key="`day-${indexWorkHour}`" class="field-checkbox">
          <Checkbox :id="`id-day-${indexWorkHour}`" name="nameHour_" :value="work_hour.id" v-model="selectedHours" />
          <label :for="`id-day-${indexWorkHour}`">{{work_hour.name}}</label>
        </div>
      </div>
      <template #footer>
        <Button label="Enviar" icon="pi pi-check" @click="sendSchedule" />
        <Button label="Cerrar" icon="pi pi-times" @click="closeBasic" autofocus class="p-button-danger"/>
      </template>
    </Dialog>
  </div>
</template>
<script>
import { mapGetters } from 'vuex';
import Panel from 'primevue/panel';
import Dialog from 'primevue/dialog';
import '@fullcalendar/core/vdom'
import FullCalendar from '@fullcalendar/vue3'
import dayGridPlugin from '@fullcalendar/daygrid'
import esLocale from '@fullcalendar/core/locales/es';
import moment from 'moment'
import qs from 'qs';
import interactionPlugin from '@fullcalendar/interaction'
import Button from 'primevue/button';
import Checkbox from 'primevue/checkbox';
export default {
  name: 'Calendar',
  components: {
    FullCalendar, dayGridPlugin, Dialog, Button, Checkbox, Panel
  },
  props: {
    startDate: String,
    endDate: String,
    hours: Array,
    contractId: Number
  },
  data() {
    return {
      colors: ['blue', 'purple', 'orange', 'brown', 'grey', 'pink'],
      moment: moment,
      session: true,
      selectedDate: null,
      displayBasic: false,
      calendarOptions: {
        locale: esLocale,
        plugins: [ dayGridPlugin, interactionPlugin ],
        initialView: 'dayGridMonth',
        validRange: {start: this.startDate, end: this.endDate},
        dateClick: this.handleDateClick,
        eventClick: this.handleEventClick,
        events: []
      },
      day: {
        work_hours: []
      },
      selectedHours: null,
      users: [
        { color: 'red', name: 'Hora Disponible' }
      ]
    };
  },
  computed: {
    ...mapGetters({
      week: 'day/week',
      currentUser: 'session/currentUser'
    }),
    modalTitle() {
      return `Fecha: ${this.selectedDate ? moment(this.selectedDate).format('DD-MM-YYYY') : ''}`
    }
  },
  watch: {
    'contractId'() {
      if (this.contractId) {
        this.getSchedule()
        this.getSchedules()
      }
    },
    'startDate'() {
      this.calendarOptions.validRange = { start: this.startDate, end: this.endDate }
    }
  },
  methods: {
    async getSchedules() {
      let params = {}
      params.filter = {
        contract: this.contractId
      }
      const response = await this.axios.get(`allotted_hours?${qs.stringify(params)}`)
      if (response.data) {
        this.setEvents(response.data)
      }
    },
    setEvents(schedulings) {
      this.users = [{ color: 'red', name: 'Hora Disponible' }]
      let events = []
      let disabledEvents = []
      let n = 1
      let hours = this.hours
      let date = moment(this.startDate)
      while (n < 8) {
        let dayIndex = this.week.findIndex((d) => d.day_number === date.day())
        if (dayIndex === -1) return
        let enabledsHours = this.week[dayIndex].work_hours.filter((e) => {
          if (hours.includes(e.id)) { return e }
        })
        enabledsHours.forEach((enabledHour) => {
          disabledEvents.push({
            title: `${enabledHour.name}_⚠️`,
            start: `${date.format('YYYY-MM-DD')}`,
            backgroundColor: 'red',
          })
        })
        schedulings.forEach((schedule, scheduleIndex) => {
          let pivotHours = []
          enabledsHours.forEach((n) => {
            if (schedule.hours.includes(n.id)) pivotHours.push(n)
          })
          pivotHours.forEach((pivotHour) => {
            events.push({
              title: `${pivotHour.name}-${schedule.user.name}`,
              start: `${date.format('YYYY-MM-DD')}`,
              backgroundColor: `${this.colors[scheduleIndex]}`,
              textColor: 'white'
            })
          })
          this.addUsers(`${this.colors[scheduleIndex]}`, schedule.user.name)
        })
        date = date.add(1, 'day')
       n++
      }
      this.calendarOptions.events = this.deleteRepeatEvents(events, disabledEvents)
    },
    addUsers(color, userName) {
      let userIndex = this.users.findIndex((user) => user.name === userName)
      if (userIndex !== -1) return
      this.users.push({
        name: userName,
        color: color
      })
    },
    deleteRepeatEvents(events, disabledEvents) {
      let _disabledEvents = []
      disabledEvents.forEach((disabledEvent) => {
        let disabledEventIndex = _disabledEvents.findIndex((e) => (e.title === disabledEvent.title && e.start === disabledEvent.start))
        if((disabledEventIndex === -1)) {
          let hour = disabledEvent.title.split('_')[0]
          let eventIndex = events.findIndex((event) => event.title.includes(hour) && event.start === `${disabledEvent.start}` )
          if (eventIndex === -1) {
            _disabledEvents.push(disabledEvent)
          }
        }
      })
      return events.concat(_disabledEvents)
    },
    async getSchedule() {
      let params = {}
      params.filter = {
        contract: this.contractId,
        user: this.currentUser.data.id
      } 
      const response = await this.axios.get(`allotted_hours?${qs.stringify(params)}`)
      if (response.data && response.data[0]) {
        this.selectedHours = response.data[0].hours
      }
    },
    sendSchedule() {
      let params = {
        user_id: this.currentUser.data.id,
        hours: this.selectedHours,
        contract_id: this.contractId,
      }
      let self = this
      this.axios.post('allotted_hours', params).then((response) => {
        self.closeBasic()
        if (response.data) {
          self.selectedHours = response.data.hours
          self.getSchedules()
        }
      })
    },
    getHours(date) {
      if (date == '') return []
      let dayIndex = this.week.findIndex(element => element.day_number === moment(date).day())
      if (dayIndex === -1) return []
      let hours = this.hours
      return this.week[dayIndex].work_hours.filter((e) => {
        if (hours.includes(e.id)) {
          return e
        }
      })
    },
    handleEventClick(arg) {
      console.log('event click', arg)
    },
    handleDateClick(arg) {
      this.selectedDate = arg.dateStr;
      this.openBasic();
    },
    openBasic() {
      this.displayBasic = true;
    },
    closeBasic() {
      this.displayBasic = false;
    }
  }
};
</script>
<style lang="css" scoped>
 .square {
    height: 15px;
    width: 15px;
    border: 1px solid black;
 }
</style>
